import express from 'express';
import {startTimer} from '../service/service.js';

const router = express.Router();

router.get('/startTimer', async (req, res) => {
    try {
        const status = await startTimer();
        res.status(status).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;