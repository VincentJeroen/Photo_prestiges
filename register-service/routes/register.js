import express from 'express';
import { createTarget, joinTarget, setTargetStart, setTargetEnd, startTarget } from '../service/service.js';

const router = express.Router();

// User
router.post('/joinTarget', async (req, res) => {
    try {
        res.status(await joinTarget(req.body));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Owner
router.post('/createTarget', async (req, res) => {
    try {
        res.status(await createTarget(req.body));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/setTargetStart', async (req, res) => {
    try {
        res.status(await setTargetStart(req.body));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/setTargetEnd', async (req, res) => {
    try {
        res.status(await setTargetEnd(req.body));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/startTarget', async (req, res) => {
    try {
        const status = await startTarget(req.body);
        res.status(status).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


export default router;