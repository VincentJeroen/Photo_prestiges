import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/clock.routes.js';
import {handleMessages} from "./service/consumer.js";

const app = express();
app.use(express.json());

// Routes
app.use('/', authRoutes);

// Channel
handleMessages();

export default app;
