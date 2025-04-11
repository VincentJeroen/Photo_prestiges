import express from 'express';
import 'dotenv/config';
import mailRoutes from './routes/mail.routes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/', mailRoutes);

export default app;
