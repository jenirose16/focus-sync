require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { User, StudySession } = require('./models');
const { generateVerificationQuiz } = require('./geminiService');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
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

// --- API CHECK ---
const apiKey = process.env.GEMINI_API_KEY || "";
console.log("Backend is using API Key ending in: ...", apiKey.slice(-4));

// --- AUTH ENDPOINTS ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email });
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- USER ENDPOINTS ---
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- QUIZ ENDPOINT ---
app.post('/api/quiz', async (req, res) => {
  const { material } = req.body;
  try {
    console.log('🤖 Gemini API Requesting with material length:', material.length);
    const quiz = await generateVerificationQuiz(material);
    console.log('✅ Gemini API Response:', quiz ? `${quiz.length} questions generated` : 'Empty response');
    res.json(quiz || [{
      question: 'What is the main goal of FocusSync?',
      options: ['To help students focus better', 'To waste time', 'To distract users', 'To test AI'],
      answer: 'To help students focus better'
    }]);
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      fallback: [{
        question: 'What is the main goal of FocusSync?',
        options: ['To help students focus better', 'To waste time', 'To distract users', 'To test AI'],
        answer: 'To help students focus better'
      }]
    });
  }
});

// Legacy endpoint for backward compatibility
app.post('/generate-quiz', async (req, res) => {
  const { material } = req.body;
  try {
    const quiz = await generateVerificationQuiz(material);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// --- SOCKET & ENDPOINTS ---
app.post('/update-status', (req, res) => {
  const { status } = req.body;
  console.log("User is currently:", status);
  io.emit('statusUpdate', { status });
  res.sendStatus(200);
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

  socket.on('status-update', (statusData) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      user.status = statusData.status;
      console.log(`⚡ ${user.name} is now ${statusData.status}`);
      io.emit('status-changed', { userId: socket.id, name: user.name, status: statusData.status });
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

// ------- quiz generation --------
app.post('/api/quiz', async (req, res) => {
  try {
    // This pulls the text out of the "content" box we sent from the frontend
    const { content } = req.body; 

    if (!content || content.trim() === "") {
      console.log("⚠️ No content received from frontend!");
      return res.status(400).json({ error: "Content is required" });
    }

    console.log("🚀 Sending content to Gemini API...");
    const questions = await generateQuiz(content); // Calling your function
    res.json(questions);

  } catch (error) {
    console.error("Server Route Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});