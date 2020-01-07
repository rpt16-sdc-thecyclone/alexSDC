const express = require('express');
const path = require('path');

const { getUsers, getProducts, getReview, getFeedback } = require('./postgresModel');

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

// Combo of ratingsFeedback and ratings
// the input is 
app.get('ratings', (req, res) => {

})

app.listen('3451', () => console.log('Listening on 3451'));
