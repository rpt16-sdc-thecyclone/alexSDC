/* eslint-disable no-console */
const { Worker, isMainThread, parentPort } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { usersTable, Review, ReviewFeedbacks, productsTable } = require('../db1/fakerData');


const client = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'aldwallis',
  database: 'review1',
});

let usersCsvCount = 0;
let usersInitial = 0;
let usersEnd = 1250000;

let productsCsvCount = 0;
let productsInitial = 0;
let productsEnd = 2500000;

let reviewsCsvCount = 0;
let reviewsInitial = 0;
let reviewsEnd = 2500000;

let reviewFeedbackCsvCount = 0;
let reviewFeedbackInitial = 0;
let reviewFeedbackEnd = 5000000;

const checkSpeed = (query) => {
  const date = new Date();
  console.log(`${query} ${date.getMinutes()}:${date.getSeconds()}`);
};

const reviewCopyQuery = `COPY reviews(id, ratings, title, description, report_abuse, isProductProp1Good, isProductProp2Good,
isProductProp3Good, created_on, userId, productId)`;

const indexCreation = () => {

  const reviewIdIndex = client.query('CREATE INDEX reviewIdIndex ON reviews(id)');
  const reviewsUserIdIndex = client.query('CREATE INDEX reviewsUserIdIndex ON reviews(userId)');
  const reviewfeedbackreviewIdIndex = client.query('CREATE INDEX reviewfeedbackreviewIdIndex ON reviewFeedback(reviewId)');
  const usersIdIndex = client.query('CREATE INDEX usersIdIndex ON users(id)');
  const productsIdIndex = client.query('CREATE INDEX productsIdIndex ON products(id)');

  Promise.all([reviewIdIndex, reviewfeedbackreviewIdIndex, usersIdIndex, reviewsUserIdIndex, productsIdIndex])
    .then(() => console.log('finished indexes and tables'))
    .catch((err) => console.error('indexCreation err: ', err));

  // reviewFeedback.reviewId
  // users.id
  // products.id
  // reviews.productId
};

const connectAndTableCreation = () => {
  checkSpeed('init');
  // Connect to db && create tables before any csv.
  // Also could look into doing jsonb tables because parsing text numbers is slower.
  client.connect()
    .then(() => {
      client.query('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, names VARCHAR(40))')
        .then(() => {
          client.query('CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY, name VARCHAR(100), productCondition VARCHAR(40), seller VARCHAR(100), prop1 VARCHAR(30), prop2 VARCHAR(30), prop3 VARCHAR(30))')
            .then(() => {
              client.query(`CREATE TABLE IF NOT EXISTS reviews(id INTEGER PRIMARY KEY, ratings SMALLINT, title VARCHAR(200), description VARCHAR(200), report_abuse SMALLINT,
                isProductProp1Good SMALLINT, isProductProp2Good SMALLINT, isProductProp3Good SMALLINT, created_on VARCHAR(40), userId INTEGER REFERENCES users(id),
                productId INTEGER REFERENCES products(id))`)
                .then(() => {
                  client.query('CREATE TABLE IF NOT EXISTS reviewFeedback(id INTEGER PRIMARY KEY, isHelpful SMALLINT, reviewId INTEGER, userId INTEGER)')
                    .then(() => {
                      indexCreation();
                    })
                    .catch((err) => console.error('reviewfeedbacktable: ', err));
                })
                .catch((err) => console.error('create table reviews err: ', err));
            })
            .catch((err) => console.error('users table: ', err));
        })
        .catch((err) => console.error('query: ', err));
    })
    .catch((err) => console.error('client connect: ', err));
};


/**
 *
 * @param {Number} initial - initial index for func
 * @param {Number} end - last index for fun
 * @param {Number} csvCount - current csv
 * @param {String} tableName - desired table
 * @param {Function} func - func from fakerData
 * @param {String} copy - copy sql query for table
 * Creates csv synchronously and sends csv file for worker to copy to db
 */

const writingCSV = (initial, end, csvCount, tableName, func, copy) => {
  fs.writeFileSync(`CSVs/${tableName}${csvCount}.csv`, func(initial, end), (err) => {
    if (err) throw err;
  });
  parentPort.postMessage({ name: `${tableName}${csvCount}.csv`, copy });
};

// isMainThread is where the worker lives
if (isMainThread) {
  connectAndTableCreation();
  // indexCreation();
  // Initalized worker in this file
  const worker = new Worker(__filename);
  // Once parentPort.postMessage resolves, (table) is argument from postMessage
  worker.on('message', (table) => {
    checkSpeed(`worker has recieved ${table.name}`);
    // could implement a stack where you push table here, but don't care about order, use atomics?
    // create var w/ that popped out and then use for tablepath and query.
    const tablePath = path.resolve('CSVs', table.name);
    client.query(`${table.copy} FROM '${tablePath}' DELIMITER ','`)
      .then(() => {
        checkSpeed(`copied ${table.name}`);
        // Typically final table copied is reviewTable5 so end the pool.
        // If this is an issue in the future, set an auto timeout after reviewTable5.
        if (table.name === 'reviewTable5.csv') {
          console.log('done');
          // process.exit(); // This may be causing a DB corruption error => error: could not access status of transaction 2545724568
          client.end();
        }
      })
      .catch((err) => console.log(err));
  });
  worker.on('error', (err) => console.log(err));
  worker.on('exit', (code) => { (code != 0) ? console.error('Worker stopped w/ code ',code) : null });
} else {
  // Generate  data and write to csv files then get worker thread to do
  // POSTGRES copy asynchronously to improve running time.
  // Users
  while (usersCsvCount < 2) {
    writingCSV(usersInitial, usersEnd, usersCsvCount, 'userTable', usersTable, 'COPY users(id, names)');
    usersCsvCount++;
    usersInitial += 1250000;
    usersEnd += 1250000;
  }

  // Products
  while (productsCsvCount < 4) {
    writingCSV(productsInitial, productsEnd, productsCsvCount, 'productsTable', productsTable, 'COPY products(id, name, productCondition, seller, prop1, prop2, prop3)');
    productsCsvCount++;
    productsInitial += 2500000;
    productsEnd += 2500000;
  }

  // Review
  while (reviewsCsvCount < 6) {
    writingCSV(reviewsInitial, reviewsEnd, reviewsCsvCount, 'reviewTable', Review, reviewCopyQuery);
    reviewsCsvCount++;
    reviewsInitial += 2500000;
    reviewsEnd += 2500000;
  }

  // ReviewFeedback
  while (reviewFeedbackCsvCount < 4) {
    writingCSV(reviewFeedbackInitial, reviewFeedbackEnd, reviewFeedbackCsvCount, 'reviewFeedbackTable', ReviewFeedbacks, 'COPY reviewFeedback(id, isHelpful, reviewId , userId)');
    reviewFeedbackCsvCount++;
    reviewFeedbackInitial += 5000000;
    reviewFeedbackEnd += 5000000;
  }
}


/**
 * 34:29 - 42:56 => 8:25
 * Got rid of serialization in table && tried client.close() didn't work:
 *  => 58:4 - 06:12 => 8:08
 * Added createTableAndConnect func and called in isMainThread() and tried client.close() again
 *  => 17:33 - 26:20 => 8:53, slower.
 * Got rid of createTableAndConnect()
 *  => 29:47 - 38:10, 8:23
 * Added createTableAndConnect()
 *  => 47:03 - 55:38, 8:35
 * Changed to if Statement w/ client.end();
 * => 59:13 - 7:26, , 8:13
 */