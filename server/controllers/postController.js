import Post from '../models/Post.js';

// ─── Create Post ─────────────────────────────────────────────────────────
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
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
    res.status(500).json({ message: err.message });
  }
};

// ─── Get Posts with Pagination ───────────────────────────────────────────
export const getPosts = async (req, res) => {
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
    res.status(500).json({ message: err.message });
  }
};
