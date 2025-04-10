import express from 'express';
import mongoose from 'mongoose';

// DotEnv
import 'dotenv/config';

// Routes
import registerRoutes from './routes/register.js';

// RabbitMQ
import {getChannel} from "./utils/rabbitmq.js";
import {handleMessages} from "./service/consumer.js";

// Database
mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

const app = express();
app.use(express.json());

// Routes
app.use('/', registerRoutes);

// Channel
getChannel();
handleMessages();


export default app;
