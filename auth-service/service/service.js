import crypto from 'crypto';
import User from '../models/user.js';
import { generateToken } from '../utils/jwt.js';

export async function registerUser({ email, password }) {
    const existingUser = await User.findOne({ email }, 'email');
    if (existingUser) {
        throw new Error('User already exists');
    }

    const user = new User({ email, password });
    await user.save();

    const token = generateToken(user);
    return { token };
}

export async function loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isValid = user.hash === crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    if (!isValid) {
        throw new Error('Invalid password');
    }

    const token = generateToken(user);
    return { token };
}