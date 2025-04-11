import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import registerRoutes from './routes/register.routes.js';
import {handleMessages} from "./service/consumer.js";

// Database
mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

const app = express();
app.use(express.json());

// Routes
app.use('/', registerRoutes);

// Channel
handleMessages();
console.log('Service started');

export default app;
