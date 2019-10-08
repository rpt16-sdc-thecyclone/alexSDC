const express =  require('express');

const service = require('./controllers.js');

const app = express();

app.use(express.static('public'));

app.get('/app.bundle.js', (req, res) => {
  res.sendFile('public/app.bundle.js', { root: '../' });
});

app.get('/ratings', (req, res) => {
  service.getRatings(1, (err, ratings) => {
    if (err) {
      res.sendStatus(400);
    }
    res.status(200).send(ratings);
  });
});

app.get('/reviews', (req, res) => {
  service.getReviews(1, (err, ratings) => {
    if (err) {
      res.sendStatus(400);
    }
    res.status(200).send(ratings);
  });
});


module.exports = app;
