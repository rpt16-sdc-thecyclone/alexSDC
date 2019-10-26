const express = require('express');
const service = require('./controllers.js');

const app = express();

app.use(express.static('public'));

app.get('/reviews', (req, res) => {
  service.getReviews(req.query.prod_id, (err, ratings) => {
    if (err) {
      res.sendStatus(400);
      return;
    }
    res.status(200).send(ratings);
  });
});

module.exports = app;
