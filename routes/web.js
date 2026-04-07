const express = require('express');
const mongoose = require('mongoose');

const Article = require('../models/Article');
const Author = require('../models/Author');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const featuredArticles = await Article.find()
      .sort({ likes: -1, createdAt: -1 })
      .limit(4)
      .populate('author', 'fullName')
      .populate('category', 'name accentColor');

    const totalLikes = featuredArticles.reduce((sum, article) => sum + (article.likes || 0), 0);

    res.render('pages/home', {
      title: 'Nova Journal',
      featuredArticles,
      totalLikes,
      errorMessage: null,
    });
  } catch (error) {
    res.render('pages/home', {
      title: 'Nova Journal',
      featuredArticles: [],
      totalLikes: 0,
      errorMessage: 'Database connection is currently unavailable.',
    });
  }
});

router.get('/articles', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { body: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'fullName')
      .populate('category', 'name accentColor');

    res.render('pages/articles', {
      title: 'Articles',
      articles,
      query: q,
      errorMessage: null,
    });
  } catch (error) {
    res.render('pages/articles', {
      title: 'Articles',
      articles: [],
      query: '',
      errorMessage: 'Could not load articles right now.',
    });
  }
});

router.get('/articles/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).render('pages/not-found', { title: 'Not Found' });
    }

    const article = await Article.findById(req.params.id)
      .populate('author', 'fullName bio avatarUrl')
      .populate('category', 'name accentColor');

    if (!article) {
      return res.status(404).render('pages/not-found', { title: 'Not Found' });
    }

    const relatedFilter = { _id: { $ne: article._id } };
    if (article.category) {
      relatedFilter.category = article.category._id;
    }

    const relatedArticles = await Article.find(relatedFilter)
      .limit(3)
      .sort({ likes: -1, createdAt: -1 })
      .populate('author', 'fullName');

    return res.render('pages/article-details', {
      title: article.title,
      article,
      relatedArticles,
    });
  } catch (error) {
    return res.status(500).render('pages/not-found', { title: 'Not Found' });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const [
      articleCount,
      authorCount,
      categoryCount,
      likesSummary,
      topArticles,
    ] = await Promise.all([
      Article.countDocuments(),
      Author.countDocuments(),
      Category.countDocuments(),
      Article.aggregate([{ $group: { _id: null, likes: { $sum: '$likes' } } }]),
      Article.find()
        .sort({ likes: -1, createdAt: -1 })
        .limit(6)
        .select('title likes createdAt')
        .populate('author', 'fullName'),
    ]);

    res.render('pages/dashboard', {
      title: 'Dashboard',
      stats: {
        articleCount,
        authorCount,
        categoryCount,
        totalLikes: likesSummary[0]?.likes || 0,
      },
      topArticles,
      errorMessage: null,
    });
  } catch (error) {
    res.render('pages/dashboard', {
      title: 'Dashboard',
      stats: {
        articleCount: 0,
        authorCount: 0,
        categoryCount: 0,
        totalLikes: 0,
      },
      topArticles: [],
      errorMessage: 'Dashboard data is temporarily unavailable.',
    });
  }
});

router.get('/about', async (req, res) => {
  try {
    const [articleCount, authorCount, categoryCount] = await Promise.all([
      Article.countDocuments(),
      Author.countDocuments(),
      Category.countDocuments(),
    ]);

    res.render('pages/about', {
      title: 'About',
      metrics: {
        articleCount,
        authorCount,
        categoryCount,
      },
      errorMessage: null,
    });
  } catch (error) {
    res.render('pages/about', {
      title: 'About',
      metrics: {
        articleCount: 0,
        authorCount: 0,
        categoryCount: 0,
      },
      errorMessage: 'Metrics are unavailable right now.',
    });
  }
});

router.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact' });
});

router.get('/articles-page', (req, res) => {
  res.redirect('/articles');
});

router.get('/sum', (req, res) => {
  res.render('ali.ejs', {
    num1: 5,
    num2: req.query.x,
    num3: req.query.y,
  });
});

module.exports = router;
