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
 * /create-account:
 *   post:
 *     summary: Maak een nieuwe gebruiker aan
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gebruiker succesvol aangemaakt
 *       400:
 *         description: Fout bij het aanmaken van de gebruiker
 *       500:
 *         description: Interne serverfout
 */
router.post('/create-account', async (req, res) => {
    try {
        const response = await authBreaker.fire(`${process.env.AUTH_SERVICE_URL}/create-account`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        console.log(err);
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to create an account' });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in met bestaande gebruiker
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Succesvolle login
 *       401:
 *         description: Ongeldige inloggegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/login', async (req, res) => {
    try {
        const response = await authBreaker.fire(`${process.env.AUTH_SERVICE_URL}/login`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || {message: 'Failed to login'});
    }
});

export default router;
