import express from 'express';
import 'dotenv/config';
import { swaggerSpec, serve, setup } from './swagger.js';
import authRoutes from './routes/auth.routes.js';
import targetRoutes from './routes/target.routes.js';
import registerRoutes from './routes/register.routes.js';
import scoreRoutes from './routes/score.routes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/', targetRoutes);
app.use('/', registerRoutes);
app.use('/', scoreRoutes);

app.use('/api-docs', serve, setup(swaggerSpec));

console.log('Gateway is running');

export default app;
