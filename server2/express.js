// require('newrelic');

const express = require('express');
const path = require('path');

const { getUsers, getProducts, getReview, getFeedback, getRatings, getReviews } = require('./postgresModel');

const app = express();
express.json();

const staticPath = path.resolve('public');

app.use(express.static(staticPath));

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
  const obj = { reviews: [] };
  getRatings(prodId)
    .then((resp) => {
      for (let i = 0; i < resp.length; i++) {
        obj.reviews[i] = { id: resp[i].id, ratings: resp[i].ratings, isProductProp1Good: resp[i].isproductprop1good, isProductProp2Good: resp[i].isproductprop2good, isProductProp3Good: resp[i].isproductprop3good };
        obj.productDetails = { seller: resp[i].seller, prop1: resp[i].prop1, prop2: resp[i].prop2, prop3: resp[i].prop3, productCondition: resp[i].productcondition };
      }
      res.status(200).send(obj);
    })
    .catch((err) => console.error('/getRatings error: ', err));
});

// http://localhost:3451/reviews?prod_id=1&limit=5&offset=1
app.get('/reviews', (req, res) => {
  const prodId = req.query.prod_id;
  const { offset } = req.query;
  const { limit } = req.query;
  // Limit is kinda expensive, maybe limit it here instead?
  getReviews(prodId, offset, limit)
    .then((resp) => res.status(200).send(resp))
    .catch((err) => console.error('/getReviews:  ', err));
});

app.listen('3451', () => console.log('Listening on 3451'));


/**
 * testing in jmeter cli
 *  JVM_ARGS="-Xms2048m -Xmx2048m" ./jmeter -n -t ../Tests/ratings.jmx
 *  -increase memory w/ jvm args -> 2GB of ram now
 *  - cli meant to be faster than GUI b/c less memory?
 */