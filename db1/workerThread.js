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
  return (console.log(`${query} ${date.getMinutes()}:${date.getSeconds()}`));
});

let writingCSV = (init, end, csvCount) => {
  //return new Promise((resolve) => {
    fs.writeFileSync(`productsTable${csvCount}.csv`, productsTable(init, end), (err) => {
      if (err) throw err;
    });
    parentPort.postMessage(`productsTable${csvCount}.csv`);
    //resolve();
  //});
};

if (isMainThread) {
  // fs.writeFile('sample.txt', calc(), (err) => err ? console.log(err) : null );
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
  // writingCSV(0, 2500000, 0);
  // writingCSV(2500000, 5000000, 1);
  // writingCSV(5000000, 7500000, 2);
  // writingCSV(7500000, 10000000, 3);
}

/**
 * if (isMainThread){ // This is where workers responses/actions live
 *    main thread is generating CSV file of 100
 *    worker thread connects to db
 *    main thread round 2 generates 2nd CSV file
 *
 *
 *
 *  let worker = new Worker('./postgreSQL.producTable??', (data)} //worker is ready to do productTable seeding
 *  worker.on('message', (data) => {
 *
 *    })
 *  }
 */