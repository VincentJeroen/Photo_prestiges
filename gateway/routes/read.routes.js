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

const readBreaker = new CircuitBreaker(callService, breakerOptions);

const router = express.Router();

/**
 * @swagger
 * /getOverview:
 *   post:
 *     summary: Verkrijg overzicht van de data
 *     tags: [Read]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: string
 *                 description: Filteropties voor het overzicht
 *     responses:
 *       200:
 *         description: Overzicht succesvol verkregen
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/getOverview', async (req, res) => {
    try {
        const response = await readBreaker.fire(`${process.env.READ_SERVICE_URL}/getOverview`, 'get', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to get overview' });
    }
});

/**
 * @swagger
 * /getScore:
 *   post:
 *     summary: Verkrijg de score van een target
 *     tags: [Read]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetId:
 *                 type: string
 *                 description: Het ID van het target waarvan de score wordt opgevraagd
 *     responses:
 *       200:
 *         description: Score succesvol verkregen
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/getScore', async (req, res) => {
    try {
        const response = await readBreaker.fire(`${process.env.READ_SERVICE_URL}/getScore`, 'get', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to get score' });
    }
});

/**
 * @swagger
 * /getScores:
 *   post:
 *     summary: Verkrijg scores van meerdere targets
 *     tags: [Read]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Een lijst van target-ID's waarvan de scores worden opgevraagd
 *     responses:
 *       200:
 *         description: Scores succesvol verkregen
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/getScores', async (req, res) => {
    try {
        const response = await readBreaker.fire(`${process.env.READ_SERVICE_URL}/getScores`, 'get', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to get scores' });
    }
});

export default router;
