import express from 'express';
import axios from 'axios';

const router = express.Router();

//TODO would be nice if these route names matched the service names. '/startTarget' mean a service has a function called startTarget
router.post('/startTarget', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.REGISTER_SERVICE_URL}/startTarget`, req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: `Internal error: ${err}` });
    }
});

export default router;