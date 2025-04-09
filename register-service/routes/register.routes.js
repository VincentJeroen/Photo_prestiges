import express from 'express';
import { register } from '../service/service.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { result } = await register(req.body);
        res.status(201).json({ result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;