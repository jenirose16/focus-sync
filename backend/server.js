require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, StudySession } = require('./models');
const { generateQuiz } = require('./geminiService');

const app = express();
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'focus_sync_secret_2026';

app.use(helmet());
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigin, methods: ['GET', 'POST'], credentials: true }
});

// --- DATABASE CONNECTION ---
// We use the 'family: 4' option here to bypass college DNS/IPv6 issues
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4
})
.then(() => console.log('✅ Connected to FocusSync Database'))
.catch(err => {
  console.error('❌ Database connection error:', err.message);
  console.log('TIP: Check if your IP is whitelisted in MongoDB Atlas Network Access.');
});

const distractionEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  socketId: String,
  hidden: Boolean,
  reason: { type: String, default: 'visibilitychange' },
  details: String,
  createdAt: { type: Date, default: Date.now }
});

const DistractionEvent = mongoose.model('DistractionEvent', distractionEventSchema);

function makeToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '12h' });
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function verifyUserOwnership(req, res, userId) {
  if (!req.user || req.user.id !== userId) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
}

// --- AUTH ENDPOINTS ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = makeToken(user);
      return res.json({
        token,
        user: { _id: user._id, username: user.username, email: user.email, avatar: user.avatar, totalXP: user.totalXP }
      });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, avatar: 'avatar1' });
    await user.save();
    const token = makeToken(user);

    return res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email, avatar: user.avatar, totalXP: user.totalXP }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.use(['/api', '/user', '/update-status'], authenticateJWT);

app.get('/user/:id', async (req, res) => {
  if (!verifyUserOwnership(req, res, req.params.id)) return;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ _id: user._id, username: user.username, email: user.email, avatar: user.avatar, totalXP: user.totalXP });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.put('/user/:id', async (req, res) => {
  if (!verifyUserOwnership(req, res, req.params.id)) return;
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { avatar }, { new: true });
    if (user) {
      return res.json({ _id: user._id, username: user.username, email: user.email, avatar: user.avatar, totalXP: user.totalXP });
    }
    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/session/heartbeat', async (req, res) => {
  try {
    const { userId, intervalMinutes, xpEarned } = req.body;
    if (!userId || !intervalMinutes || !xpEarned) {
      return res.status(400).json({ error: 'Missing heartbeat payload' });
    }
    if (!verifyUserOwnership(req, res, userId)) return;

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalXP: xpEarned } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await StudySession.findOneAndUpdate(
      { userId, endTime: null },
      {
        $inc: { focusScore: intervalMinutes / 60 },
        $setOnInsert: { startTime: new Date() },
        $set: { materialStudied: `Active focus session (${intervalMinutes} minutes logged)` }
      },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      user: { _id: user._id, totalXP: user.totalXP },
      session
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/session/end', async (req, res) => {
  try {
    const { userId, totalFocusTime } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    if (!verifyUserOwnership(req, res, userId)) return;

    const session = await StudySession.findOneAndUpdate(
      { userId, endTime: null },
      { endTime: new Date(), focusScore: totalFocusTime / 60, quizPassed: true },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Active session not found' });
    }

    return res.json({ success: true, session });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/history/:userId', async (req, res) => {
  if (!verifyUserOwnership(req, res, req.params.userId)) return;
  try {
    const response = await getUserHistory(req.params.userId);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/history', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId query parameter' });
  }
  if (!verifyUserOwnership(req, res, userId)) return;

  try {
    const response = await getUserHistory(userId);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

async function getUserHistory(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const sessions = await StudySession.find({ userId }).sort({ startTime: -1 });
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSessions = sessions.filter(session => session.startTime >= sevenDaysAgo);

  const dailyStats = {};
  recentSessions.forEach(session => {
    const day = session.startTime.toISOString().split('T')[0];
    if (!dailyStats[day]) dailyStats[day] = { hours: 0, sessions: 0 };
    if (session.endTime && session.startTime) {
      dailyStats[day].hours += (session.endTime - session.startTime) / (1000 * 60 * 60);
    }
    dailyStats[day].sessions += 1;
  });

  const focusTrends = Object.entries(dailyStats).map(([date, data]) => ({
    date,
    hours: Math.round(data.hours * 10) / 10,
    sessions: data.sessions
  })).sort((a, b) => a.date.localeCompare(b.date));

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      totalXP: user.totalXP
    },
    sessions: sessions.map(session => ({
      _id: session._id,
      startTime: session.startTime,
      endTime: session.endTime,
      focusScore: session.focusScore,
      quizPassed: session.quizPassed,
      materialStudied: session.materialStudied
    })),
    focusTrends,
    totalSessions: sessions.length,
    totalFocusTime: sessions.reduce((total, session) => {
      if (session.endTime && session.startTime) {
        return total + (session.endTime - session.startTime) / (1000 * 60 * 60);
      }
      return total;
    }, 0)
  };
}

app.post('/api/quiz', async (req, res) => {
  const content = req.body.content || req.body.material;
  try {
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Study material is required for quiz generation' });
    }

    console.log('🤖 Gemini RAG quiz request for user:', req.user?.id);
    const quiz = await generateQuiz(content);
    console.log('✅ Gemini API Response:', quiz ? `${quiz.length} questions generated` : 'Empty response');
    return res.json(quiz || [{
      question: 'What is the main goal of FocusSync?',
      options: ['To help students focus better', 'To waste time', 'To distract users', 'To test AI'],
      answer: 'To help students focus better'
    }]);
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    return res.status(500).json({
      error: 'Failed to generate quiz',
      fallback: [{
        question: 'What is the main goal of FocusSync?',
        options: ['To help students focus better', 'To waste time', 'To distract users', 'To test AI'],
        answer: 'To help students focus better'
      }]
    });
  }
});

app.post('/generate-quiz', authenticateJWT, async (req, res) => {
  const { material } = req.body;
  try {
    const quiz = await generateQuiz(material);
    return res.json(quiz);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

app.post('/update-status', (req, res) => {
  const { status } = req.body;
  console.log('User is currently:', status);
  io.emit('statusUpdate', { status });
  return res.sendStatus(200);
});

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('✅ Student connected:', socket.id);

  socket.on('join-study-room', (userData) => {
    const userInfo = { socketId: socket.id, ...userData, status: 'Focused' };
    activeUsers.set(socket.id, userInfo);
    console.log('📍 User joined:', userData.name);
    io.emit('student-joined', { students: Array.from(activeUsers.values()), lastJoined: userInfo });
  });

  socket.on('visibilitychange', async (payload) => {
    const user = activeUsers.get(socket.id);
    if (!payload || typeof payload.hidden !== 'boolean') return;

    if (payload.hidden) {
      const studentId = user?.userId || payload.studentId || null;
      await DistractionEvent.create({
        userId: studentId,
        socketId: socket.id,
        hidden: true,
        details: payload.details || 'Visibility state changed to hidden'
      });
      console.log(`⚠️ Distraction Detected for Student ${studentId || 'unknown'}`);
      io.emit('distraction-detected', { studentId, hidden: true });
    }
  });

  socket.on('status-update', (statusData) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      user.status = statusData.status;
      console.log(`⚡ ${user.name} is now ${statusData.status}`);
      io.emit('status-changed', { userId: user.userId || socket.id, name: user.name, status: statusData.status });
    }
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      console.log('👋 User left:', user.name);
      activeUsers.delete(socket.id);
      io.emit('student-left', { userId: socket.id, name: user.name, remainingStudents: Array.from(activeUsers.values()) });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`FocusSync Brain (Backend) running on port ${PORT}`);
});