const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { productsTable } = require('../db1/fakerData');


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
  fs.writeFileSync(`CSVs/productsTable${csvCount}.csv`, productsTable(initial, end), (err) => {
    if (err) throw err;
  });
  parentPort.postMessage(`productsTable${csvCount}.csv`);
};

if (isMainThread) {
  console.log('isMain')
  client.connect().then(() => {
    client.query('CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY, name VARCHAR(100), productCondition VARCHAR(40), seller VARCHAR(100), prop1 VARCHAR(30), prop2 VARCHAR(30), prop3 VARCHAR(30))')
      .catch((err) => console.log(err));
  }).catch((err) => console.log(err));

  let worker = new Worker(__filename, { workerData });
  worker.on('message', (table) => {
    let tablePath = path.resolve('CSVs', table);
    checkSpeed(`create ${table}`);
    client.query(`COPY products(id, name, productCondition, seller, prop1, prop2, prop3) FROM '${tablePath}' DELIMITER ','`)
      .then(() => {
        // if (table === 'productsTable3.csv') {
          checkSpeed(`copied ${table}`);
        // }
      })
      .catch((err) => console.log(err));
  });
  worker.on('error', (err) => console.log(err));
  worker.on('exit', (code) => { (code != 0) ? console.error('Worker stopped w/ code ',code) : null; } );
} else {
  checkSpeed('init');
  while (csvCount < 4) {
    writingCSV(initial, end, csvCount);
    csvCount++;
    initial += 2500000;
    end += 2500000;
  }
}

/**
 * Prior to this, when I checked the last activity monitor the CPU usage would look
 * like a heartbeat, it'd go up and down, but now its a lot more constant.
 *
 * w/ while loop 18:10 - 16:35 => 1:22
 * w/o 29:17 - 27:33 => 1:44
 */