const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { usersTable } = require('../db1/fakerData');


const client = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'aldwallis',
  database: 'review1',
});

let csvCount = 0;
let initial = 0;
let end = 1250000;

const checkSpeed = (query) => {
  const date = new Date();
  console.log(`${query} ${date.getMinutes()}:${date.getSeconds()}`);
};

let writingCSV = (initial, end, csvCount) => {
  fs.writeFileSync(`CSVs/userTable${csvCount}.csv`, usersTable(initial, end), (err) => {
    if (err) throw err;
  });
  parentPort.postMessage(`userTable${csvCount}.csv`);
};


if (isMainThread) {
  // Maybe don't need to connect depending on order of running files
  client.connect().then(() => {
    client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, names VARCHAR(100))')
      .catch((err) => console.log(err));
  }).catch((err) => console.log(err));

  let worker = new Worker(__filename, { workerData });
  worker.on('message', (table) => {
    let userPath = path.resolve('CSVs', table);
    client.query(`COPY users(id, names) FROM '${userPath}' DELIMITER ','`)
      .then(() => {
        if (table === 'userTable1.csv') {
          checkSpeed('copied last user table');
        }
      })
      .catch((err) => console.log(err));
  });
  worker.on('error', (err) => console.log(err));
  worker.on('exit', (code) => { (code != 0) ? console.error('Worker stopped w/ code ',code) : null; } );
} else {
  checkSpeed('init users');
  while (csvCount < 2) {
    writingCSV(initial, end, csvCount);
    csvCount++;
    initial += 1250000;
    end += 1250000;
  }
}

/**
 * Take 13s to run.
 */