import express from 'express';

// DotEnv
import 'dotenv/config';

const app = express();
app.use(express.json());

export default app;