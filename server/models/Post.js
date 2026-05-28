import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
      index: true,  // Index for filtering posts by author
    },
    coverImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index: optimised for "fetch my posts, newest first"
postSchema.index({ author: 1, createdAt: -1 });

// Index for global feed sorted by date
postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);
