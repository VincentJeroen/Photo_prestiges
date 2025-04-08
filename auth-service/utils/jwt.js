import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    const payload = {
        uid: user.uid,
        email: user.email,
        role: user.role
    };

    // Return token
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
};

const verifyToken = (token) => {
    try {
        // Return token
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export {generateToken, verifyToken};
