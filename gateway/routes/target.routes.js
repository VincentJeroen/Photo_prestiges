import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/target', async (req, res) => {
    try {
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;