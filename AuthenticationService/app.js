import express from 'express';
import crypto from 'crypto';
import User from './models/user.js';
import {generateToken} from './utils/jwt.js';

const app = express();
app.use(express.json());

// Register Route
app.post('/register', async (req, res) => {
    try {
        const {email, password, role = 'user'} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email }, 'email');
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        // Create new user
        const user = new User({email, password, role});
        await user.save();

        const token = generateToken(user);

        res.status(201).json({token});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        // Verify password
        const validPassword = user.hash === crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
        if (!validPassword) {
            return res.status(401).json({message: 'Invalid password'});
        }

        const token = generateToken(user);
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
});

// Logout Route
app.post('/logout', (req, res) => {
    // Token blacklist logic goes here
    res.status(200).json({message: 'Logged out successfully'});
});

export default app;
