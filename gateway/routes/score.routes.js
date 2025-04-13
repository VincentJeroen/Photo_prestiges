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
 * /getScore:
 *   post:
 *     summary: Haal de score op van een gebruiker voor een specifiek target
 *     tags: [Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetId
 *               - email
 *             properties:
 *               targetId:
 *                 type: string
 *                 description: Het ID van het target
 *               email:
 *                 type: string
 *                 description: Het e-mailadres van de gebruiker
 *             example:
 *               targetId: "target123"
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Score succesvol opgehaald
 *       401:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.get('/getScore', async (req, res) => {
    try {
        const response = await authBreaker.fire(`${process.env.SCORE_SERVICE_URL}/getScore`, 'get', req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err);
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Kon score niet ophalen' });
    }
});

/**
 * @swagger
 * /getAllScore:
 *   get:
 *     summary: Haal alle scores op
 *     tags: [Score]
 *     responses:
 *       200:
 *         description: Alle scores succesvol opgehaald
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Interne serverfout
 */
router.get('/getAllScore', async (req, res) => {
    try {
        const response = await authBreaker.fire(`${process.env.SCORE_SERVICE_URL}/getAllScore`, 'get', req.body);
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err);
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Kon scores niet ophalen' });
    }
});

export default router;
