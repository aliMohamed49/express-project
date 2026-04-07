const express = require('express');
const mongoose = require('mongoose');

const Article = require('../models/Article');

const router = express.Router();

router.get('/articles', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const articles = await Article.find()
      .sort({ likes: -1, createdAt: -1 })
      .limit(limit)
      .populate('author', 'fullName')
      .populate('category', 'name accentColor');

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/articles', async (req, res) => {
  try {
    const { title, body, likes, author, category } = req.body;

    const article = await Article.create({
      title,
      body,
      likes: likes || 0,
      author: author || null,
      category: category || null,
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/articles/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid article id' });
    }

    const article = await Article.findById(req.params.id)
      .populate('author', 'fullName bio avatarUrl')
      .populate('category', 'name accentColor');

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    return res.json(article);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/articles/:id/like', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid article id' });
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    return res.json(article);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid article id' });
    }

    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    return res.json({ message: 'Article deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
