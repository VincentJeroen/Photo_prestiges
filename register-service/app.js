import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import registerRoutes from './routes/register.routes.js';
import {handleMessages} from "./service/consumer.js";
import promBundle from 'express-prom-bundle';

// Database
mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

// Monitoring
const metricsMiddleware = promBundle({ includeMethod: true });

const app = express();
app.use(express.json());
app.use(metricsMiddleware);

// Routes
app.use('/', registerRoutes);

// Channel
handleMessages();
console.log('Service started');

export default app;
