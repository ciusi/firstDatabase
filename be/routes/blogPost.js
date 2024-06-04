const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');

// Rotta per ottenere la lista di blog post con paginazione
router.get('/blogPosts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < await BlogPost.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.results = await BlogPost.find().limit(limit).skip(startIndex).exec();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per ottenere un singolo blog post
router.get('/blogPosts/:id', getBlogPost, (req, res) => {
  res.json(res.blogPost);
});

// Rotta per creare un nuovo blog post
router.post('/blogPosts', async (req, res) => {
  const blogPost = new BlogPost(req.body);

  try {
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per modificare un blog post
router.put('/blogPosts/:id', getBlogPost, async (req, res) => {
  try {
    await res.blogPost.updateOne(req.body);
    res.json({ message: 'Blog post aggiornato' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per cancellare un blog post
router.delete('/blogPosts/:id', getBlogPost, async (req, res) => {
  try {
    await res.blogPost.remove();
    res.json({ message: 'Blog post cancellato' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware per ottenere un singolo blog post
async function getBlogPost(req, res, next) {
  let blogPost;
  try {
    blogPost = await BlogPost.findById(req.params.id);
    if (blogPost == null) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blogPost = blogPost;
  next();
}

module.exports = router;
