import express from 'express';
// import { registerUser, loginUser } from '../service/service.js';

const router = express.Router();

router.post('/target', async (req, res) => {
    try {
        // const { token } = await registerUser(req.body);
        // res.status(201).json({ token });
    } catch (error) {
        // res.status(400).json({ message: error.message });
    }
});

export default router;