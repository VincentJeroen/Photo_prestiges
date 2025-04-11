import express from 'express';
import { generateScore } from '../service/service.js';

const router = express.Router();

router.post('/generate-score', async (req, res) => {
    try {
        const response = await generateScore(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;