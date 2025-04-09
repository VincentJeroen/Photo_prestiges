import express from 'express';
import mongoose from 'mongoose';

// DotEnv
import 'dotenv/config';

// Routes
import authRoutes from './routes/auth.js';
import {handleMessages} from "./service/consumer.js";

// Database
mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

const app = express();
app.use(express.json());

// Routes
app.use('/', authRoutes);

// Channel
handleMessages();

export default app;
