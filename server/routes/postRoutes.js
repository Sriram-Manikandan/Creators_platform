import express from 'express';
import { createPost, getPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes are protected - only authenticated users can access them
router.post('/', protect, createPost);
router.get('/', protect, getPosts);

export default router;
