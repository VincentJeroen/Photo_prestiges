import express from 'express';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';

const router = express.Router();
const upload = multer({ dest: 'temp/' });

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

        form.append('targetId', req.body.targetId);
        form.append('email', req.body.email);

        const targetServiceResponse = await axios.post(`${process.env.TARGET_SERVICE_URL}/uploadPhoto`, form, {
            headers: form.getHeaders(),
        });
    
        // Clean up temp file
        fs.unlinkSync(req.file.path);

        if (targetServiceResponse.status === 200) {
            res.status(200).json(targetServiceResponse.data);

            // Call score service
            const body = {
                targetId: req.body.targetId,
                email: req.body.email,
                photoUrl: targetServiceResponse.data.photoUrl,
            }
            const scoreServiceResponse = await axios.post(`${process.env.SCORE_SERVICE_URL}/score`, body);
            if (scoreServiceResponse.status === 200) {
                return res.status(200).json(scoreServiceResponse.data);
            } else {
                return res.status(scoreServiceResponse.status).json({ message: scoreServiceResponse.data });
            }
        } else {
            return res.status(targetServiceResponse.status).json({ message: targetServiceResponse.data });
        }
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).send('Failed to upload file');
    }
});

router.post('/deletePhoto', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.TARGET_SERVICE_URL}/deletePhoto`, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/deleteParticipantPhoto', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.TARGET_SERVICE_URL}/deleteParticipantPhoto`, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;