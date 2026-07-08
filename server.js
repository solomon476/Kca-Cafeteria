const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// JWT Secret Key (in production, set this in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cafeteria_key';

// Mock in-memory database
const users = []; 

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- Authentication APIs ---

// 1. Sign Up
app.post('/api/signup', async (req, res) => {
    const { name, studentId, password } = req.body;
    
    if (!name || !studentId || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.studentId === studentId);
    if (existingUser) {
        return res.status(400).json({ error: 'User with this ID already exists' });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to our "database"
    const newUser = { id: Date.now().toString(), name, studentId, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'User created successfully' });
});

// 2. Login
app.post('/api/login', async (req, res) => {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
        return res.status(400).json({ error: 'Please provide Student ID and password' });
    }

    // Find the user
    const user = users.find(u => u.studentId === studentId);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, name: user.name, studentId: user.studentId }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Logged in successfully', token, name: user.name });
});

// 3. Get Current User (used on page refresh to restore session)
app.get('/api/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // The token is valid, return the user info stored in the token
        res.json({ name: decoded.name, studentId: decoded.studentId });
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Basic API route for health check
app.get('/api/status', (req, res) => {
    res.json({ status: 'Backend is running!', timestamp: new Date() });
});

// Fallback to index.html for any other GET requests (for single page apps)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server (only if not in Vercel production)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
