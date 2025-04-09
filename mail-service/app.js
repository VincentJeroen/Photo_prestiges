import express from 'express';

// DotEnv
import 'dotenv/config';

// Routes
import mailRoutes from './routes/mail.routes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/', mailRoutes);

export default app;
