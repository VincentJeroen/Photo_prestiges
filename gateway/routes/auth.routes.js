import express from 'express';
import axios from 'axios';
import CircuitBreaker from 'opossum';

// Circuit Breaker
const callService = async (url, method = 'get', data = null) => {
    return axios({ method, url, data });
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
 *     summary: Registreer een nieuwe gebruiker
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Gebruiker succesvol aangemaakt
 *         content:
 *           application/json:
 *             example:
 *               message: Account created successfully
 *               userId: abc123
 *       400:
 *         description: Ongeldige invoer of fout bij registratie
 *         content:
 *           application/json:
 *             example:
 *               message: Email already exists
 *       500:
 *         description: Interne serverfout
 *         content:
 *           application/json:
 *             example:
 *               message: Failed to create an account
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
 *     summary: Log in als bestaande gebruiker
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Succesvolle login
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user:
 *                 id: abc123
 *                 email: user@example.com
 *       401:
 *         description: Ongeldige inloggegevens
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid email or password
 *       500:
 *         description: Interne serverfout
 *         content:
 *           application/json:
 *             example:
 *               message: Failed to login
 */
router.post('/login', async (req, res) => {
    try {
        const response = await authBreaker.fire(`${process.env.AUTH_SERVICE_URL}/login`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to login' });
    }
});

export default router;
