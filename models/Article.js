const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 180,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 6000,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;