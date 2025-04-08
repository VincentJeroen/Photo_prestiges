import express from 'express';
import { registerUser, loginUser } from '../service/service.js';

const router = express.Router();

router.post('/registerr', async (req, res) => {
    try {
        const { token } = await registerUser(req.body);
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/loginn', async (req, res) => {
    try {
        const { token } = await loginUser(req.body);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;