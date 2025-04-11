import express from 'express';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';
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

const targetBreaker = new CircuitBreaker(callService, breakerOptions);

const router = express.Router();
const upload = multer({dest: 'temp/'});

// router.get('/images/:filename', async (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const response = await axios.get(`${process.env.TARGET_SERVICE_URL}/images/${filename}`);
//         return res.status(response.status).json({ imageUrl: response.data.imageUrl });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

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
            return res.status(targetServiceResponse.status).json({message: targetServiceResponse.data});
        }

        // Call score service
        const body = {
            targetId: req.body.targetId,
            email: req.body.email,
            photoUrl: targetServiceResponse.data.photoUrl,
        }
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

router.post('/deletePhoto', async (req, res) => {
    try {
        const response = await targetBreaker.fire(`${process.env.TARGET_SERVICE_URL}/deletePhoto`, 'post', req.body);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.post('/deleteParticipantPhoto', async (req, res) => {
    try {
        const response = await targetBreaker.fire(`${process.env.TARGET_SERVICE_URL}/deleteParticipantPhoto`, 'post', req.body);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

export default router;