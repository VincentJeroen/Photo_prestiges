import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import targetRoutes from './routes/target.routes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/', targetRoutes);
console.log('Target service is running');

export default app;
