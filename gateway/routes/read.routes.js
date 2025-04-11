import express from 'express';
import axios from 'axios';
import CircuitBreaker from 'opossum';

// Circuit Breaker
const callService = async (url, method = 'get', data = null) => {
    return axios({method, url, data});
};
const breakerOptions = {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
};

const readBreaker = new CircuitBreaker(callService, breakerOptions);

const router = express.Router();

router.post('/getOverview', async (req, res) => {
    try {
        const response = await readBreaker.fire(`${process.env.READ_SERVICE_URL}/getOverview`, 'get', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Failed to get overview'});
    }
});

router.post('/getScore', async (req, res) => {
    try {
        const response = await readBreaker.fire(`${process.env.READ_SERVICE_URL}/getScore`, 'get', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Failed to get score'});
    }
});

router.post('/getScores', async (req, res) => {
    try {
        const response = await readBreaker.fire(`${process.env.READ_SERVICE_URL}/getScores`, 'get', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Failed to get scores'});
    }
});

export default router;