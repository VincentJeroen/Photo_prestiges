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

const registerBreaker = new CircuitBreaker(callService, breakerOptions);

const router = express.Router();

router.post('/joinTarget', async (req, res) => {
    try {
        {
            const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/isTargetJoinable`, 'post', req.body);
            if (response.status !== 200) {
                return res.status(response.status).send({message: 'Target is not joinable'});
            }
        }

        const response = await registerBreaker.fire(`${process.env.SCORE_SERVICE_URL}/joinTarget`, 'post', req.body);
        return res.status(response.status).json(response);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Failed to join target'});
    }
});

// TODO: remove this as uploadPhoto in target.js will do this
router.post('/startTarget', async (req, res) => {
    try {
        const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/startTarget`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Failed to start target'});
    }
});

router.post('/createTarget', async (req, res) => {
    try {
        const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/createTarget`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Failed to create target'});
    }
});

router.post('/setTargetDuration', async (req, res) => {
    try {
        const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/setTargetDuration`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Failed to set target duration'});
    }
});

export default router;