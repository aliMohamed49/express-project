require('dotenv').config();

const express = require('express');
const path = require('path');

const connectDB = require('./config/db');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
//
const app = express();
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.siteName = 'Nova Journal';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).render('pages/not-found', { title: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

connectDB()
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  });