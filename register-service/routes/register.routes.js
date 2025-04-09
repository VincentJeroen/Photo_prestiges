import express from 'express';
import { startTarget, joinTarget } from '../service/service.js';

const router = express.Router();

router.post('/startTarget', async (req, res) => {
    try {
        const { result } = await startTarget(req.body);
        res.status(201).json({ result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/joinTarget', async (req, res) => {
    try {
        const { result } = await joinTarget(req.body);
        res.status(201).json({ result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;