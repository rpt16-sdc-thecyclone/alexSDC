const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const { productsTable } = require('./fakerData');


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
  return console.log(`${query} ${date.getMinutes()}:${date.getSeconds()}`);
};

let writingCSV = (initial, end, csvCount) => {
    fs.writeFileSync(`productsTable${csvCount}.csv`, productsTable(initial, end), (err) => {
      if (err) throw err;
    });
    parentPort.postMessage(`productsTable${csvCount}.csv`);
};

if (isMainThread) {
  client.connect().then(() => {
    client.query('CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY, name VARCHAR(100), productCondition VARCHAR(40), seller VARCHAR(100), prop1 VARCHAR(30), prop2 VARCHAR(30), prop3 VARCHAR(30))')
      .catch((err) => console.log(err));
  }).catch((err) => console.log(err));

  let worker = new Worker(__filename, { workerData });
  worker.on('message', (table) => {
    console.log(table);
    let tablePath = path.resolve(table);
    client.query(`COPY products(id, name, productCondition, seller, prop1, prop2, prop3) FROM '${tablePath}' DELIMITER ','`)
      .then(() => {
        const done = checkSpeed(tablePath);
        console.log('copy', done);
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