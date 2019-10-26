const express = require('express');
const service = require('./controllers.js');

const app = express();
express.json();

app.use(express.static('public'));

app.get('/ratings', (req, res) => {
  service.getAllRatings(req.query.prod_id, (err, ratings) => {
    if (err) {
      res.sendStatus(400);
      return;
    }
    res.status(200).send(ratings);
  });
});

app.get('/reviews', (req, res) => {
  //console.log(req);
  console.log('------------------->',req.query);
  const pagingAndSorting = {
    offset: +req.query.offset,
    limit: +req.query.limit
  };
  service.getReviews(req.query.prod_id, pagingAndSorting, (err, ratings) => {
    if (err) {
      res.sendStatus(400);
      return;
    }
    res.status(200).send(ratings);
  });
});

module.exports = app;
