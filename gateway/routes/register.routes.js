import express from 'express';
import axios from 'axios';

const router = express.Router();

// TODO: remove this as uploadPhoto in target.js will do this
router.post('/startTarget', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.REGISTER_SERVICE_URL}/startTarget`, req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: `Internal error: ${err}` });
    }
});

router.post('/setStart', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.REGISTER_SERVICE_URL}/setStart`, req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: `Internal error: ${err}` });
    }
});

router.post('/setEnd', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.REGISTER_SERVICE_URL}/setEnd`, req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: `Internal error: ${err}` });
    }
});

export default router;