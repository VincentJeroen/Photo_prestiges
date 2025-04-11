import express from 'express';
import mongoose from 'mongoose';

// DotEnv
import 'dotenv/config';

// Routes
import scoreRoutes from './routes/score.js';

// Database
mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

const app = express();
app.use(express.json());

// Routes
app.use('/', scoreRoutes);
console.log('Score service is running');

export default app;
