const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { Review } = require('../db1/fakerData');


const client = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'aldwallis',
  database: 'review1',
});

let csvCount = 0;
let initial = 0;
let end = 2500000;

const checkSpeed = (query) => {
  const date = new Date();
  console.log(`${query} ${date.getMinutes()}:${date.getSeconds()}`);
};

let writingCSV = (initial, end, csvCount) => {
  fs.writeFileSync(`CSVs/reviewTable${csvCount}.csv`, Review(initial, end), (err) => {
    if (err) throw err;
  });
  parentPort.postMessage({ name: `reviewTable${csvCount}.csv`, count: csvCount });
};


if (isMainThread) {
  client.connect().then(() => {
    client.query(`CREATE TABLE IF NOT EXISTS reviews(id SERIAL PRIMARY KEY, ratings INTEGER, title VARCHAR(200), description VARCHAR(200), report_abuse INTEGER,
      isProductPropGood1Good INTEGER, isProductPropGood2Good INTEGER, isProductPropGood3Good INTEGER, created_on VARCHAR(40), userId INTEGER REFERENCES users(id),
      productId INTEGER REFERENCES products(id))`)
      .catch((err) => console.log(err));
  }).catch((err) => console.log(err));

  let worker = new Worker(__filename, { workerData });
  worker.on('message', (table) => {
    checkSpeed(`worker has recieved ${table.name}`);
    const tablePath = path.resolve('CSVs', table.name);
    client.query(`COPY reviews(id, ratings, title, description, report_abuse, isProductPropGood1Good, isProductPropGood2Good,
    isProductPropGood3Good, created_on, userId, productId) FROM '${tablePath}' DELIMITER ','`)
      .then(() => checkSpeed(`copied ${table.name}`))
      .catch((err) => console.log(err));
  });
  worker.on('error', (err) => console.log(err));
  worker.on('exit', (code) => { (code != 0) ? console.error('Worker stopped w/ code ',code) : null; } );
} else {
  checkSpeed('init');
  while (csvCount < 6) {
    writingCSV(initial, end, csvCount);
    csvCount++;
    initial += 2500000;
    end += 2500000;
  }
}

/**
 * Slower than I'd like, but if I add in a second worker it looks like it isn't creating the table
 * fast enough for postgres because psql gives me missing data columns for data that exist when I look
 * at the csv file itself and it isn't isolated to just one column
 * 5:54 w/ 8 1.875(15m), ~2min csv creation, copy tables spread out reasonably
 *  -time between last worker recieved and first copy ~3min
 *  -copy process took around 1m
 * 5:42 w/ 6 2.5m(15m), ~2.5min csv creation, copy tables spread out, time between last worker recieved and first copy is 2min
 *  -copy process took around a minute.
 * 5:05 w/ 7 2m(14m), 1:55 csv creation, time between last worker recieved and first copy is 2m40s
 *  -copy process 25sec
 * 5:58 w/ 7 2m & 1 1m(15m). 2m12s for csv creation, time between last worker recieved and first copy is 2m38s
 *  -copy process is 1m8s
 */
