const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { ReviewFeedbacks } = require('../db1/fakerData');


const client = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'aldwallis',
  database: 'review1',
});

let csvCount = 0;
let initial = 0;
let end = 5000000;

const checkSpeed = (query) => {
  const date = new Date();
  console.log(`${query} ${date.getMinutes()}:${date.getSeconds()}`);
};

let writingCSV = (initial, end, csvCount) => {
  fs.writeFileSync(`CSVs/reviewFeedbackTable${csvCount}.csv`, ReviewFeedbacks(initial, end), (err) => {
    if (err) throw err;
  });
  parentPort.postMessage({ name: `reviewFeedbackTable${csvCount}.csv`, count: csvCount });
};


if (isMainThread) {
  client.connect().then(() => {
    // Can get rid of id serial, already in order from CSV
    client.query('CREATE TABLE IF NOT EXISTS reviewFeedback(id INTEGER PRIMARY KEY, isHelpful INTEGER, reviewId INTEGER REFERENCES reviews(id), userId INTEGER REFERENCES users(id))')
      .catch((err) => console.log(err));
  }).catch((err) => console.log(err));

  let worker = new Worker(__filename, { workerData });
  worker.on('message', (table) => {
    checkSpeed(`worker has recieved ${table.name}`);
    const tablePath = path.resolve('CSVs', table.name);
    client.query(`COPY reviewFeedback(id, isHelpful, reviewId , userId) FROM '${tablePath}' DELIMITER ','`)
      .then(() => {
        checkSpeed(`copied ${table.name}`)
        if (table.name == 'reviewFeedbackTable0.csv') {
          console.log('y')
          client.end().then(() => console.log('end pool'))
        }
      })
      .catch((err) => console.log(err));
  });
  worker.on('error', (err) => console.log(err));
  worker.on('exit', (code) => { (code != 0) ? console.error('Worker stopped w/ code ',code) : null; } );
} else {
  checkSpeed('init');
  while (csvCount < 1) {
    writingCSV(initial, end, csvCount);
    csvCount++;
    initial += 5000000;
    end += 5000000;
  }
}

/**
 * 20m records, 4x5m: created tables/csv in 41s. Gap between last recieved and first copy is: 5:48
 *  -total copy time: 12s
 *  -total time: 6:41s
 */