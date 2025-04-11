import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
  
const upload = multer({ storage });
  
  // Routes using Multer
router.post('/uploadPhoto', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.status(200).send({ photoUrl: req.file.filename });
});

// router.get('/images/:filename', async (req, res) => {
//     try {
//         // const filename = req.params.filename;
//         // const response = await axios.get(`${process.env.TARGET_SERVICE_URL}/images/${filename}`);
//         // return res.status(response.status).json({ imageUrl: response.data.imageUrl });


//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

export default router;