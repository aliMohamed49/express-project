const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  } , 

  likes : {
    type : Number , 
    default : 0
  }

});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;