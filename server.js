const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cafeteria_key';
const MONGODB_URI = process.env.MONGODB_URI;

// --- MongoDB Connection ---
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    if (!MONGODB_URI) {
        console.warn('⚠️  MONGODB_URI not set. Running with in-memory fallback.');
        return;
    }
    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
    }
}

// --- User Schema ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- In-memory fallback (used if MongoDB is not configured) ---
const inMemoryUsers = [];

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- Authentication APIs ---

// 1. Sign Up
app.post('/api/signup', async (req, res) => {
    await connectDB();
    const { name, studentId, password } = req.body;

    if (!name || !studentId || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (isConnected) {
            // MongoDB path
            const existing = await User.findOne({ studentId });
            if (existing) return res.status(400).json({ error: 'An account with this Student ID already exists' });

            await User.create({ name, studentId, password: hashedPassword });
        } else {
            // In-memory fallback
            const existing = inMemoryUsers.find(u => u.studentId === studentId);
            if (existing) return res.status(400).json({ error: 'An account with this Student ID already exists' });
            inMemoryUsers.push({ id: Date.now().toString(), name, studentId, password: hashedPassword });
        }

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    await connectDB();
    const { studentId, password } = req.body;

    if (!studentId || !password) {
        return res.status(400).json({ error: 'Please provide Student ID and password' });
    }

    try {
        let user;
        if (isConnected) {
            user = await User.findOne({ studentId });
        } else {
            user = inMemoryUsers.find(u => u.studentId === studentId);
        }

        if (!user) {
            return res.status(401).json({ error: 'No account found with this Student ID. Please sign up first!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password. Please try again.' });
        }

        const token = jwt.sign(
            { id: user._id || user.id, name: user.name, studentId: user.studentId },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ message: 'Logged in successfully', token, name: user.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// 3. Get Current User (restore session on page refresh)
app.get('/api/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ name: decoded.name, studentId: decoded.studentId });
    } catch (err) {
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
});

// Health check
app.get('/api/status', (req, res) => {
    res.json({ status: 'Backend is running!', db: isConnected ? 'MongoDB' : 'in-memory', timestamp: new Date() });
});

// Fallback to index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server (only locally)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
