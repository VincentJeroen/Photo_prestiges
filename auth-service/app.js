import express from 'express';
import mongoose from 'mongoose';

// DotEnv
import 'dotenv/config';

// Routes
import authRoutes from './routes/auth.routes.js';

// Database
mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

const app = express();
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

export default app;
