import express from 'express';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';
import CircuitBreaker from 'opossum';

// Circuit Breaker
const callService = async (url, method = 'get', data = null, options = {}) => {
    return axios({ method, url, data, ...options });
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
 * /images/{filename}:
 *   get:
 *     summary: Haal een afbeelding op via bestandsnaam
 *     tags: [Target]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: De bestandsnaam van de afbeelding
 *     responses:
 *       200:
 *         description: Afbeelding succesvol opgehaald
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Afbeelding niet gevonden
 *       500:
 *         description: Interne serverfout
 */
router.get('/images/:filename', async (req, res) => {
    const filename = req.params.filename;

    try {
        const imageResponse = await targetBreaker.fire(
            `${process.env.TARGET_SERVICE_URL}/images/${filename}`,
            'get',
            null,
            { responseType: 'stream' }
        );

        res.setHeader('Content-Type', imageResponse.headers['content-type']);
        res.setHeader('Content-Disposition', imageResponse.headers['content-disposition'] || 'inline');

        imageResponse.data.pipe(res);
    } catch (error) {
        console.error('Error fetching image from service:', error.message);
        res.status(404).json({ message: 'Image not found' });
    }
});

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
 *             required:
 *               - image
 *               - targetId
 *               - email
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
    if (!req.file) return res.status(400).send('No file uploaded');
    if (!req.body.targetId) return res.status(400).send('No targetId provided');
    if (!req.body.email) return res.status(400).send('No email provided');

    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(req.file.path), req.file.originalname);

        const targetServiceResponse = await targetBreaker.fire(
            `${process.env.TARGET_SERVICE_URL}/uploadPhoto`,
            'post',
            form,
            { headers: form.getHeaders() }
        );

        fs.unlinkSync(req.file.path);

        if (targetServiceResponse.status !== 200) {
            return res.status(targetServiceResponse.status).json({ message: targetServiceResponse.data });
        }

        const body = {
            targetId: req.body.targetId,
            email: req.body.email,
            photoUrl: targetServiceResponse.data.photoUrl,
        };

        const scoreServiceResponse = await targetBreaker.fire(
            `${process.env.SCORE_SERVICE_URL}/generate-score`,
            'post',
            body
        );

        return res.status(scoreServiceResponse.status).json(scoreServiceResponse.data);
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
 *             required:
 *               - targetId
 *               - photoId
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
 *             required:
 *               - targetId
 *               - participantId
 *             properties:
 *               targetId:
 *                 type: string
 *                 description: Het ID van het target
 *               participantId:
 *                 type: string
 *                 description: Het ID van de deelnemer wiens foto verwijderd moet worden
 *     responses:
 *       200:
 *         description: Deelnemersfoto succesvol verwijderd
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
