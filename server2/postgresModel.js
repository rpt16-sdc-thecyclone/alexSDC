const { Pool } = require('pg');
const csv = require('csvtojson');

const client = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'aldwallis',
  database: 'review1',
});


const getUsers = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('SELECT * FROM users;')
          .then((r) => resolve(r.rows));
      });
  });
};


let getProducts = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('SELECT * FROM products;')
          .then((r) => resolve(r.rows));
      });
  });
};

let getReview = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('SELECT * FROM reviews;')
          .then((r) => resolve(r.rows));
      });
  });
};

let getFeedback = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('SELECT * FROM reviewfeedback;')
          .then((r) => resolve(r.rows));
      });
  });
};

module.exports = { getUsers, getProducts, getReview, getFeedback }