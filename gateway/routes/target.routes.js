import express from 'express';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';
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

const targetBreaker = new CircuitBreaker(callService, breakerOptions);

const router = express.Router();
const upload = multer({ dest: 'temp/' });

/**
 * @swagger
 * /uploadPhoto:
 *   post:
 *     summary: Upload een foto voor een target
 *     tags: [Target]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: De afbeelding die geüpload wordt
 *               targetId:
 *                 type: string
 *                 description: Het ID van het target
 *               email:
 *                 type: string
 *                 description: Het emailadres van de gebruiker
 *     responses:
 *       200:
 *         description: Foto succesvol geüpload en score gegenereerd
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/uploadPhoto', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    if (!req.body.targetId) {
        return res.status(400).send('No targetId provided');
    }

    if (!req.body.email) {
        return res.status(400).send('No email provided');
    }

    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(req.file.path), req.file.originalname);

        const targetServiceResponse = await targetBreaker.fire(`${process.env.TARGET_SERVICE_URL}/uploadPhoto`, 'post', form, {
            headers: form.getHeaders(),
        });

        // Clean up temp file
        fs.unlinkSync(req.file.path);

        if (targetServiceResponse.status !== 200) {
            return res.status(targetServiceResponse.status).json({ message: targetServiceResponse.data });
        }

        // Call score service
        const body = {
            targetId: req.body.targetId,
            email: req.body.email,
            photoUrl: targetServiceResponse.data.photoUrl,
        };
        const scoreServiceResponse = await targetBreaker.fire(`${process.env.SCORE_SERVICE_URL}/generate-score`, 'post', body);
        if (scoreServiceResponse.status === 200) {
            return res.status(scoreServiceResponse.status).json(scoreServiceResponse.data);
        }

        return res.status(200).json(scoreServiceResponse.data);
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).send('Failed to upload file');
    }
});

/**
 * @swagger
 * /deletePhoto:
 *   post:
 *     summary: Verwijder een foto van een target
 *     tags: [Target]
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
 *               photoId:
 *                 type: string
 *                 description: Het ID van de foto die verwijderd moet worden
 *     responses:
 *       200:
 *         description: Foto succesvol verwijderd
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/deletePhoto', async (req, res) => {
    try {
        const response = await targetBreaker.fire(`${process.env.TARGET_SERVICE_URL}/deletePhoto`, 'post', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /deleteParticipantPhoto:
 *   post:
 *     summary: Verwijder de foto van een deelnemer
 *     tags: [Target]
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
 *               participantId:
 *                 type: string
 *                 description: Het ID van de deelnemer wiens foto verwijderd moet worden
 *     responses:
 *       200:
 *         description: Deelnemers foto succesvol verwijderd
 *       400:
 *         description: Ongeldige gegevens
 *       500:
 *         description: Interne serverfout
 */
router.post('/deleteParticipantPhoto', async (req, res) => {
    try {
        const response = await targetBreaker.fire(`${process.env.TARGET_SERVICE_URL}/deleteParticipantPhoto`, 'post', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
