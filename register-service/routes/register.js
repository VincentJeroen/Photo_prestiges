import express from 'express';
import { createTarget, joinTarget, setTargetDuration, startTarget } from '../service/service.js';

const router = express.Router();

// User
router.post('/joinTarget', async (req, res) => {
    try {
        res.status(await joinTarget(req.body)).json({ message: 'Target joined successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Owner
router.post('/createTarget', async (req, res) => {
    try {
        res.status(200).json({ targetId: await createTarget(req.body)} );
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/setTargetDuration', async (req, res) => {
    try {
        res.status(await setTargetDuration(req.body)).json({ message: 'Target duration set successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/startTarget', async (req, res) => {
    try {
        const status = await startTarget(req.body);
        res.status(status).json({ message: 'Target started successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


export default router;