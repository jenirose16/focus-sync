const mongoose = require('mongoose');

// 1. User Schema: Stores profile, total XP, and rewards
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    avatar: { type: String, default: 'avatar1' }, // Default avatar
    totalXP: { type: Number, default: 0 },
    currentStatus: { type: String, default: 'Offline' }, // Focused, Distracted, or Offline
    inventory: [String] // List of earned rewards or badges
}, { timestamps: true }); // Add createdAt and updatedAt

// 2. StudySession Schema: Tracks each "Closed-Loop" session
const studySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    focusScore: Number, // Percentage of time spent focused
    quizPassed: { type: Boolean, default: false }, // Verified via Gemini AI
    materialStudied: String // Topic or PDF name
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const StudySession = mongoose.model('StudySession', studySessionSchema);

module.exports = { User, StudySession };