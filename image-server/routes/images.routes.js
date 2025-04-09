import express from 'express';
import axios from 'axios';

const router = express.Router();

// image
// router.post('/', async (req, res) => {
//     try {
//         const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/create-account`, req.body);
//         res.status(response.status).send(response.data);
//     } catch (err) {
//         res.status(err.response?.status || 500).send(err.response?.data || { message: `Internal error: ${err}` });
//     }
// });

export default router;