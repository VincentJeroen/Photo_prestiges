import express from 'express';
import {startConsumer} from '../service/service.js';

const router = express.Router();

router.get('/ditiseentest', async (req, res) => {
    try {
        await startConsumer();
        res.status(200).send('✅ Consumer gestart'); // 👈 voeg send() toe
    } catch (error) {
        res.status(400).json({ message: "❌ Fout bij starten consumer: " + error.message });
    }
});

export default router;