import express from 'express';
import { generateScore, joinTarget } from '../service/service.js';

const router = express.Router();

router.post('/generate-score', async (req, res) => {
    try {
        const response = await generateScore(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/joinTarget', async (res, req) => {
    try {
        if (await joinTarget(req.body)) {
            return res.status(200).json({ message: 'User joined target' });
        } else {
            return res.status(400).json({ message: 'User already in target' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;