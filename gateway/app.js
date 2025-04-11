import express from 'express';

// DotEnv
import 'dotenv/config';

// Routes
import authRoutes from './routes/auth.routes.js';
import targetRoutes from './routes/target.routes.js';
import registerRoutes from './routes/register.routes.js';
import readRoutes from './routes/read.routes.js';
import axios from "axios";

const app = express();
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/', targetRoutes);
app.use('/', registerRoutes);
app.use('/', readRoutes);

console.log('Gateway is running');

export default app;
