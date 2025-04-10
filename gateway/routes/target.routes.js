import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/uploadPhoto', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.TARGET_SERVICE_URL}/uploadPhoto`, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/deletePhoto', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.TARGET_SERVICE_URL}/deletePhoto`, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/deleteParticipantPhoto', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.TARGET_SERVICE_URL}/deleteParticipantPhoto`, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;