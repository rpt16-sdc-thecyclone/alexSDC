/* eslint-disable no-console */
const { Pool } = require('pg');
const path = require('path');

const usersCSV = path.resolve('userTable.csv');

const productCSV1 = path.resolve('productsTable.csv');
const productCSV2 = path.resolve('productsTable2.csv');

const reviewCSV1 = path.resolve('reviewTable1.csv');
const reviewCSV2 = path.resolve('reviewTable2.csv');
const reviewCSV3 = path.resolve('reviewTable3.csv');
const reviewCSV4 = path.resolve('reviewTable4.csv');
const reviewCSV5 = path.resolve('reviewTable5.csv');
const reviewCSV6 = path.resolve('reviewTable6.csv');

const reviewFeedbackCSV = path.resolve('reviewFeedbackCSV.csv');

// const { Review, ReviewFeedbacks, productsTable, usersTable } = require('./fakerData');

const client = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'aldwallis',
  database: 'review1',
});

// const creatingTables = () => {
//   return new Promise((resolve) => {
//     client.connect()
//       .then(() => {
//         client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, names jsonb not null)')
//           .then(() => {
//             client.query('CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY, name VARCHAR(40), productCondition VARCHAR(10), seller VARCHAR(100), prop1 VARCHAR(20), prop2 VARCHAR(20), prop3 VARCHAR(20))')
//               .then(() => {
//                 client.query(`CREATE TABLE IF NOT EXISTS reviews(id SERIAL PRIMARY KEY, ratings INTEGER, title VARCHAR(200), description VARCHAR(200), report_abuse INTEGER,
//                   isProductPropGood1Good INTEGER, isProductPropGood2Good INTEGER, isProductPropGood3Good INTEGER, created_on VARCHAR(40), userId INTEGER REFERENCES users(id),
//                   productId INTEGER REFERENCES products(id))`)
//                   .then(() => {
//                     client.query('CREATE TABLE IF NOT EXISTS reviewFeedback(id SERIAL PRIMARY KEY, isHelpful INTEGER, reviewId INTEGER REFERENCES reviews(id), userId INTEGER REFERENCES users(id))')
//                       .then(() => resolve(console.log('created all tables')))
//                       .catch((err) => console.error('reviewfeedbacktable: ', err));
//                   })
//                   .catch((err) => console.error('create table reviews err: ', err));
//               })
//               .catch((err) => console.error('users table: ', err));
//           })
//         .catch((err) => console.error('query: ', err));
//       })
//     .catch((err) => console.error('client connect: ', err));
//   })
// };


const checkSpeed = (query) => new Promise((resolve) => {
  const date = new Date();
  resolve(console.log(`${query} ${date.getMinutes()}:${date.getSeconds()}`));
});

const seedUsers = () => {
  checkSpeed('start seedUsers');
  client.connect()
    .then(() => {
      client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, names jsonb not null)')
        .then(() => {
          client.query(`COPY users(id, names) FROM '${usersCSV}' DELIMITER ','`)
            .then(() => {
              // client.end(() => console.log('pool ended'));
              checkSpeed('end seedUsers');
            })
            .catch((err) => console.error('copy from users CSV err:', err));
        })
        .catch((err) => console.error('create users table error ', err));
    })
    .catch((err) => console.error(err));
};

const seedProducts = () => {
  checkSpeed('start seedProducts');
  client.connect()
    .then(() => {
      client.query('CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY, name VARCHAR(100), productCondition VARCHAR(40), seller VARCHAR(100), prop1 VARCHAR(30), prop2 VARCHAR(30), prop3 VARCHAR(30))')
        .then(() => {
          client.query(`COPY products(id, name, productCondition, seller, prop1, prop2, prop3) FROM '${productCSV1}' DELIMITER ','`)
            .then(() => {
              client.query(`COPY products(id, name, productCondition, seller, prop1, prop2, prop3) FROM '${productCSV2}' DELIMITER ','`)
                .then(() => {
                  // client.end(() => console.log('pool ended'));
                  checkSpeed('end seedProducts');
                });
            })
            .catch((err) => console.error('copy productCSV1', err));
        })
        .catch((err) => console.error('products create table: ', err));
    })
    .catch((err) => console.error('seedProducts', err));
};

const seedReview = () => {
  checkSpeed('start review');
  client.connect()
    .then((r) => {
      console.log('connecting to postgres', r);
      client.query(`CREATE TABLE IF NOT EXISTS reviews(id SERIAL PRIMARY KEY, ratings INTEGER, title VARCHAR(200), description VARCHAR(200), report_abuse INTEGER,
        isProductPropGood1Good INTEGER, isProductPropGood2Good INTEGER, isProductPropGood3Good INTEGER, created_on VARCHAR(40), userId INTEGER REFERENCES users(id),
        productId INTEGER REFERENCES products(id))`)
        .then(() => {
          console.log('created table');
          client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
            isProductPropGood3Good, created_on, userId, productId) FROM '${reviewCSV1}' DELIMITER ','`)
            .then(() => {
              console.log('copied reviewsCSV1');
              client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
                isProductPropGood3Good, created_on, userId, productId) FROM '${reviewCSV2}' DELIMITER ','`)
                .then(() => {
                  console.log('copied from reviews2');
                  client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
                    isProductPropGood3Good, created_on, userId, productId) FROM '${reviewCSV3}' DELIMITER ','`)
                    .then(() => {
                      client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
                        isProductPropGood3Good, created_on, userId, productId) FROM '${reviewCSV4}' DELIMITER ','`)
                        .then(() => {
                          client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
                            isProductPropGood3Good, created_on, userId, productId) FROM '${reviewCSV5}' DELIMITER ','`)
                            .then(() => {
                              client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
                                isProductPropGood3Good, created_on, userId, productId) FROM '${reviewCSV6}' DELIMITER ','`)
                                .then(() => {
                                  checkSpeed('end reviews');
                                })
                                .catch((err) => console.log('copy from reviewCSV6', err));
                            })
                            .catch((err) => console.log('copy from reviewCSV5', err));
                        })
                        .catch((err) => console.log('copy from reviewCSV4', err));
                    })
                    .catch((err) => console.error('copy from reviewCSV3', err));
                })
                .catch((err) => console.error('copy from reviewCSV2 err', err));
            })
            .catch((err) => console.error('copy from reviewCSV1 err', err));
        })
        .catch((err) => console.error('seedReview create table err', err));
    })
    .catch((err) => console.error('seedReview client.connect err', err));
};

const seedReviewFeedback = () => {
  checkSpeed('start seedReviewFeedback');
  client.connect()
    .then(() => {
      client.query('CREATE TABLE IF NOT EXISTS reviewFeedback(id SERIAL PRIMARY KEY, isHelpful INTEGER, reviewId INTEGER REFERENCES reviews(id), userId INTEGER REFERENCES users(id))')
        .then(() => {
          client.query(`COPY reviewFeedback(id, isHelpful, reviewId , userId) FROM '${reviewFeedbackCSV}' DELIMITER ','`)
            .then(() => {
              client.end(() => console.log('pool ended'));
              checkSpeed('end seedReviewFeedback');
            });
        })
        .catch((err) => console.error('copy users error ', err));
    })
    .catch((err) => console.error(err));
};

// const seedDB = () => {
//   checkSpeed('start seed');
//   client.connect()
//     .then(() => {
//       client.query(`COPY users(id, names) FROM '${usersCSV}' DELIMITER ','`)
//         .then(() => {
//           client.query(`COPY products(id, name, productCondition, seller, prop1, prop2, prop3) FROM '${productCSV}' DELIMITER ','`)
//             .then(() => {
//               client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
//               isProductPropGood3Good, created_on, userId, productId) FROM '${reviewCSV1}' DELIMITER ','`)
//                 .then(() => {
//                   client.query(`COPY reviewFeedback(id, isHelpful, reviewId , userId) FROM '${reviewFeedbackCSV}' DELIMITER ','`)
//                     .then(() => {
//                       checkSpeed('end seed')
//                       client.end(() => console.log('pool ended'))
//                     })
//                     .catch((err) => console.error('copy reviewFeedback', err));
//                 })
//                 .catch((err) => console.error('copy reviews: ', err));
//             })
//             .catch((err) => console.error('copy products: ', err));
//         })
//         .catch((err) => console.error('COPY users: ', err));
//     });
// };


// const main = () => {
// creatingTables()
//   .then(() => seedDB());
// };

// main();

module.exports = { seedUsers, seedReviewFeedback, seedProducts, seedReview }