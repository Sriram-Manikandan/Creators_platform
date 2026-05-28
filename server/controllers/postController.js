import Post from '../models/Post.js';

// ─── Create Post ─────────────────────────────────────────────────────────
export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400);
      return next(new Error('Title and content are required'));
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id, // User ID attached by the auth middleware
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Posts with Pagination ───────────────────────────────────────────
export const getPosts = async (req, res, next) => {
  try {
    // Default to page 1, limit 5 if not provided
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    // We only fetch the posts created by the logged-in user
    const query = { author: req.user._id };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      data: posts,
      meta: {
        totalPosts,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Post by ID ───────────────────────────────────────────────
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      return next(new Error('Post not found'));
    }

    // Ownership check (optional for viewing, but required here per specs)
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('User not authorized to access this post'));
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Post ─────────────────────────────────────────────────────────
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      return next(new Error('Post not found'));
    }

    // Ownership check: only the author can update their post
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('User not authorized to update this post'));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || post.title,
        content: req.body.content || post.content,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Post ─────────────────────────────────────────────────────────
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      return next(new Error('Post not found'));
    }

    // Ownership check: only the author can delete their post
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('User not authorized to delete this post'));
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
