import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const secret = process.env.JWT_SECRET;
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
