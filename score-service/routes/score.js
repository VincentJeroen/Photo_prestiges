import express from 'express';
import { generateScore, joinTarget, getScore } from '../service/service.js';

const router = express.Router();

router.post('/generate-score', async (req, res) => {
    try {
        const response = await generateScore(req.body);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

router.post('/joinTarget', async (req, res) => {
    try {
        if (await joinTarget(req.body)) {
            return res.status(200).json({ message: 'User joined target' });
        } else {
            return res.status(400).json({ message: 'User already in target' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.get('/getScore', async (req, res) => {
    try {
        const response = await getScore(req.body);
        res.status(200).json({ score: response });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
});

export default router;