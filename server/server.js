import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();      // ← Must be FIRST
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS — before all routes
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Server is running!',
        status: 'OK'
    });
});

// Error handling middleware MUST be defined after all routes
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});