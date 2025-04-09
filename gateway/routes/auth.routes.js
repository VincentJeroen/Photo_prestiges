import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/create-account', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/create-account`, req.body);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/login`, req.body);
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Internal error' });
    }
});

export default router;