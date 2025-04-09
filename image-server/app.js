

// // Routes
// import imageRoutes from './routes/images.routes.js';

// const app = express();
// app.use(express.json());

// // Routes
// app.use('/', imageRoutes);

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DotEnv
import 'dotenv/config';

const app = express();
app.use(express.json());

// Create Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
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
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.status(200).send(`File uploaded successfully: ${req.file.filename}`);
});

app.use('/images', express.static(path.join(__dirname, 'uploads')));

export default app;