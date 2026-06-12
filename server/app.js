import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/upload.js';
import timingMiddleware from './middleware/timing.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(timingMiddleware);

app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is running!',
    status: 'OK',
  });
});

app.use(errorHandler);

export default app;
