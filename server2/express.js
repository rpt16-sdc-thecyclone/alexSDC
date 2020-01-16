const express = require('express');
const path = require('path');

const { getUsers, getProducts, getReview, getFeedback, getRatings, getReviews } = require('./postgresModel');

const app = express();
express.json();

const staticPath = path.resolve('public');

app.use('/', express.static(staticPath));

// app.get('/users', (req, res) => {
//   getUsers()
//     .then((resp) => {
//       // let stringify = JSON.stringify(resp);
//       res.status(200).send(resp);
//     });
// });

// app.get('/products', (req, res) => {
//   getProducts()
//     .then((resp) => {
//       res.status(200).send(resp);
//     });
// });

// app.get('/reviews', (req, res) => {
//   getReview()
//     .then((resp) => {
//       res.status(200).send(resp);
//     });
// });

// app.get('/feedback', (req, res) => {
//   getFeedback()
//     .then((resp) => {
//       res.status(200).send(resp);
//     });
// });

// Combo of ratingsFeedback and ratings - sql join products productId with reviews productId
// Should have multiple reviews for each product. looks like {reviews: {}, productDetails: {}}
// Inside reviews array of objects key is index,
// ie. {reviews: 0: {id: 1, ratings: 2, productId: 1, isProductProp1Good: false, isProductProp2Good: false, isProductProp1Good: false}}
// Inside productDetails from productTable is just an obj
// ie. {productDetails: {seller: X, prop1: Y, prop2: Z, productCondition: Good}}

app.get('/ratings', (req, res) => {
  const prodId = req.query.prod_id;
  getRatings(prodId)
    .then((resp) => res.status(200).send(resp));
});

// http://localhost:3451/reviews?prod_id=1&limit=5&offset=1
app.get('/reviews', (req, res) => {
  const prodId = req.query.prod_id;
  const { offset } = req.query;
  const { limit } = req.query;
  // Limit is kinda expensive, maybe limit it here instead?
  getReviews(prodId, offset, limit)
    .then((resp) => res.status(200).send(resp));
});

/**
 * app.get('/reviews', (req, res) => {
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
 */

app.listen('3451', () => console.log('Listening on 3451'));
