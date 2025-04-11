import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import targetRoutes from './routes/target.routes.js';

// Database
mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

const app = express();
app.use(express.json());

// Routes
app.use('/', targetRoutes);
console.log('Target service is running');

export default app;
