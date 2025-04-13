import express from 'express';
import 'dotenv/config';
import mailRoutes from './routes/mail.routes.js';
import {handleMessages} from "./service/consumer.js";

const app = express();
app.use(express.json());

// Routes
app.use('/', mailRoutes);
handleMessages();
console.log('Mail service is running');

export default app;
