import express from 'express';
import 'dotenv/config';
import { swaggerSpec, serve, setup } from './swagger.js';
import authRoutes from './routes/auth.routes.js';
import targetRoutes from './routes/target.routes.js';
import registerRoutes from './routes/register.routes.js';
import scoreRoutes from './routes/score.routes.js';
import {authenticateToken} from "./middlewares/jwt-token-middleware.js";

const app = express();
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/', authenticateToken, targetRoutes);
app.use('/', authenticateToken, registerRoutes);
app.use('/', authenticateToken, scoreRoutes);

app.use('/api-docs', serve, setup(swaggerSpec));

console.log('Gateway is running');

export default app;
