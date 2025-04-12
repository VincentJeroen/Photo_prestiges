import express from 'express';
import { createTarget, isTargetJoinable, setTargetDuration, startTarget, getOverview } from '../service/service.js';

const router = express.Router();

// User
router.get('/isTargetJoinable', async (req, res) => {
    if (await isTargetJoinable(req.body)) {
        res.status(200).send();
    } else {
        res.status(400).send();
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

router.get('/getOverview', async (req, res) => {
    try {
        const overview = await getOverview();
        res.status(200).json(overview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;