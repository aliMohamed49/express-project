const express = require('express');
const mongoose = require('mongoose');

const Article = require('./models/Article');

const app = express();
//mongodb+srv://u9877236526_db_user:<db_password>@cluster1.evfrbng.mongodb.net/?appName=Cluster1

mongoose.connect('mongodb+srv://u9877236526_db_user:LNn7u33iBrE7Hu4c@cluster1.evfrbng.mongodb.net/?appName=Cluster1')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
const port = 3000;



app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/sum', (req, res) => {


  res.render('ali.ejs', { num1: 5, num2: req.query.x , num3: req.query.y});

});


// Create a new article
app.post('/articles', async (req, res) => {
  try {

    const article = new Article();
    article.title = req.body.title;
    article.body = req.body.body;
    article.likes = req.body.likes || 0;
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get('/articles' , async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});