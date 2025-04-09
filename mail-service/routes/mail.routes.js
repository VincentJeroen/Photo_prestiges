import express from 'express';
import { sendMail } from '../service/service.js';

const router = express.Router();

router.post('/send-mail', async (req, res) => {
    try {
        res.status(await sendMail(req.body));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;