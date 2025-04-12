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

const authBreaker = new CircuitBreaker(callService, breakerOptions);

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in met bestaande gebruiker
 *     tags: [Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetId:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Score opgehaald
 *       401:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.get('/getScore', async (req, res) => {
    try {
        const response = await authBreaker.fire(`${process.env.SCORE_SERVICE_URL}/getScore`, 'get', req.body);
        res.status(response.status).send(response);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Kon score niet ophalen'});
    }
});

export default router;
