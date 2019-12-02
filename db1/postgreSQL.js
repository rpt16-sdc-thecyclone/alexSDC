/* eslint-disable no-console */
const { Pool } = require('pg');
const path = require('path');

const usersCSV = path.resolve('userTable.csv');
const productCSV = path.resolve('productsTable.csv');
const reviewCSV1 = path.resolve('reviewTable1.csv');
const reviewCSV2 = path.resolve('reviewTable2.csv');
const reviewFeedbackCSV = path.resolve('reviewFeedbackCSV.csv');

// const { Review, ReviewFeedbacks, productsTable, usersTable } = require('./fakerData');

const client = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'aldwallis',
  database: 'review1',
});

const creatingTables = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, names jsonb not null)')
          .then(() => {
            client.query('CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY, name VARCHAR(40), productCondition VARCHAR(10), seller VARCHAR(100), prop1 VARCHAR(20), prop2 VARCHAR(20), prop3 VARCHAR(20))')
              .then(() => {
                client.query(`CREATE TABLE IF NOT EXISTS reviews(id SERIAL PRIMARY KEY, ratings INTEGER, title VARCHAR(200), description VARCHAR(200), report_abuse INTEGER,
                  isProductPropGood1Good INTEGER, isProductPropGood2Good INTEGER, isProductPropGood3Good INTEGER, created_on VARCHAR(40), userId INTEGER REFERENCES users(id),
                  productId INTEGER REFERENCES products(id))`)
                  .then(() => {
                    client.query('CREATE TABLE IF NOT EXISTS reviewFeedback(id SERIAL PRIMARY KEY, isHelpful INTEGER, reviewId INTEGER REFERENCES reviews(id), userId INTEGER REFERENCES users(id))')
                      .then(() => resolve(console.log('created all tables')))
                      .catch((err) => console.error('reviewfeedbacktable: ', err));
                  })
                  .catch((err) => console.error('create table reviews err: ', err));
              })
              .catch((err) => console.error('users table: ', err));
          })
        .catch((err) => console.error('query: ', err));
      })
    .catch((err) => console.error('client connect: ', err));
  })  
};


const checkSpeed = (query) => new Promise((resolve) => {
  const date = new Date();
  resolve(console.log(`${query} ${date.getMinutes()}:${date.getSeconds()}`));
});


const seedDB = () => {
  checkSpeed('start seed');
  client.connect()
    .then(() => {
      client.query(`COPY users(id, names) FROM '${usersCSV}' DELIMITER ','`)
        .then(() => {
          client.query(`COPY products(id, name, productCondition, seller, prop1, prop2, prop3) FROM '${productCSV}' DELIMITER ','`)
            .then(() => {
              client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
              isProductPropGood3Good, created_on, userId, productId) FROM '${reviewCSV1}' DELIMITER ','`)
                .then(() => {
                  client.query(`COPY reviewFeedback(id, isHelpful, reviewId , userId) FROM '${reviewFeedbackCSV}' DELIMITER ','`)
                    .then(() => {
                      checkSpeed('end seed')
                      client.end(() => console.log('pool ended'))
                    })
                    .catch((err) => console.error('copy reviewFeedback', err));
                })
                .catch((err) => console.error('copy reviews: ', err));
            })
            .catch((err) => console.error('copy products: ', err));
        })
        .catch((err) => console.error('COPY users: ', err));
    });
};



const main = () => {
  creatingTables()
    .then(() => seedDB());
};

main();