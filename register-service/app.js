import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// DotEnv
import 'dotenv/config';

// Routes
import registerRoutes from './routes/register.js';

// RabbitMQ
import {handleMessages} from "./service/consumer.js";

// Database
mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

const app = express();
// app.use(cors({
//     origin: process.env.GATEWAY_URL,
//     methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
// }));
app.use(express.json());

// Routes
app.use('/', registerRoutes);

// Channel
handleMessages();
console.log('Service started');

export default app;
