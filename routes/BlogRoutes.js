const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Middlewares
const authenticateToken = require('../middleware/auth');
const requireSession = require('../middleware/sessionAuth');

// Choose one: either JWT or session. For now, let's switch to session:
const protect = requireSession; // or use authenticateToken for JWT

// CREATE a new blog post
router.post('/', protect, async (req, res) => {
  try {
    const post = new BlogPost({
      ...req.body,
      author: req.session.userId // or req.user.id for JWT
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all blog posts
router.get('/', protect, async (req, res) => {
    try {
      const posts = await BlogPost.find()
        .sort({ createdAt: -1 })
        .populate('author', 'username'); // 🧠 only get username
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // READ a single post by ID
  router.get('/:id', protect, async (req, res) => {
    try {
      const post = await BlogPost.findById(req.params.id)
        .populate('author', 'username');
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

// UPDATE a blog post
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a blog post
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
