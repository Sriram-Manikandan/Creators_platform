import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const postRoutes = (io) => {
  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  // All routes are protected - only authenticated users can access them
  router.post('/', protect, createPost);
  router.get('/', protect, getPosts);
  router.get('/:id', protect, getPostById);
  router.put('/:id', protect, updatePost);
  router.delete('/:id', protect, deletePost);

  return router;
};

export default postRoutes;
