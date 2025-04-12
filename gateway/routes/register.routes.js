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

const registerBreaker = new CircuitBreaker(callService, breakerOptions);

const router = express.Router();

/**
 * @swagger
 * /joinTarget:
 *   post:
 *     summary: Voeg een target toe als het joinable is
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetId:
 *                 type: string
 *                 description: Het ID van het target
 *               userId:
 *                 type: string
 *                 description: Het ID van de gebruiker die wil joinen
 *     responses:
 *       200:
 *         description: Doel succesvol toegevoegd
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/joinTarget', async (req, res) => {
    try {
        const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/isTargetJoinable`, 'get', req.body);
        if (response.status !== 200) {
            return res.status(response.status).send({ message: 'Target is not joinable' });
        }

        const response2 = await registerBreaker.fire(`${process.env.SCORE_SERVICE_URL}/joinTarget`, 'post', req.body);
        return res.status(response2.status).json(response2.data);
    } catch (err) {
        console.log(err);
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to join target' });
    }
});

/**
 * @swagger
 * /startTarget:
 *   post:
 *     summary: Start een target
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetId:
 *                 type: string
 *                 description: Het ID van het target
 *     responses:
 *       200:
 *         description: Doel succesvol gestart
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/startTarget', async (req, res) => {
    try {
        const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/startTarget`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to start target' });
    }
});

/**
 * @swagger
 * /createTarget:
 *   post:
 *     summary: Maak een nieuw target aan
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Naam van het target
 *               duration:
 *                 type: integer
 *                 description: Duur van het target in seconden
 *     responses:
 *       200:
 *         description: Target succesvol aangemaakt
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/createTarget', async (req, res) => {
    try {
        const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/createTarget`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to create target' });
    }
});

/**
 * @swagger
 * /setTargetDuration:
 *   post:
 *     summary: Stel de duur van een target in
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetId:
 *                 type: string
 *                 description: Het ID van het target
 *               duration:
 *                 type: integer
 *                 description: Duur van het target in seconden
 *     responses:
 *       200:
 *         description: Duur succesvol ingesteld
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/setTargetDuration', async (req, res) => {
    try {
        const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/setTargetDuration`, 'post', req.body);
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to set target duration' });
    }
});

/**
 * @swagger
 * /getOverview:
 *   get:
 *     summary: Haal overview van alle huidige wedstrijden op
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Duur succesvol ingesteld
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.get('/getOverview', async (req, res) => {
    try {
        const response = await registerBreaker.fire(`${process.env.REGISTER_SERVICE_URL}/getOverview`, 'get');
        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || { message: 'Failed to get overview' });
    }
});

export default router;
