import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/getOverview', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.READ_SERVICE_URL}/getOverview`, req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: `Internal error: ${err}` });
    }
});

router.post('/getScore', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.READ_SERVICE_URL}/getScore`, req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: `Internal error: ${err}` });
    }
});

router.post('/getScores', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.READ_SERVICE_URL}/getScores`, req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: `Internal error: ${err}` });
    }
});


export default router;