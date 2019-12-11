/* eslint-disable no-console */
const fs = require('fs');
const fsPromise = require('fs').promises;
// eslint-disable-next-line object-curly-newline
const { usersTable, Review, ReviewFeedbacks, productsTable } = require('./fakerData');
const { seedUsers, seedReviewFeedback, seedProducts } = require('./postgreSQL');

const chunk = 100000;
// const maxRecords = 10000000;
const productRecords = 10000000;

const usersCSV = () => {
  const dato = new Date();
  console.log('userCSV:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('userTable.csv', usersTable(), (err) => {
    if (err) {
      throw err;
    } else {
      const ddato = new Date();
      console.log('userCSV:', ddato.getMinutes(), ddato.getSeconds());
      seedUsers();
    }
  });
};


const reviewCSV1 = () => {
  const dato = new Date();
  console.log('reviewCSV1:', dato.getMinutes(), dato.getSeconds());
  // fs.writeFile('reviewTable1.csv', Review());
  fs.writeFile('reviewTable1.csv', Review(0, chunk), (err) => {
    if (err) throw err;
  });
  fs.writeFile('reviewTable2.csv');
  // want to write a file where we create 10 chunks of 100k records
  let count = 1;
  for (let i = chunk; i < maxRecords; i += chunk) {
    const init = (count + 1) * chunk;
    if ((i < 5000000) && (i % chunk === 0)) {
      fs.appendFile('reviewTable1.csv', Review(i, init));
      console.log('reviewTable1.csv: ', i, init);
      count++;
    }
    if ((i >= 5000000) && (i % chunk === 0)) {
      fs.appendFile('reviewTable2.csv', Review(i, init));
      count++;
      console.log('reviewTable2.csv: ', i, init);
    }
  }
  const ddato = new Date();
  console.log('reviewCSV1:', ddato.getMinutes(), ddato.getSeconds());
};

const reviewFeedbackCSV = () => {
  const dato = new Date();
  console.log('reviewFeedbackCSV:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('reviewFeedbackCSV.csv', ReviewFeedbacks(), (err) => {
    if (err) {
      throw err;
    } else {
      seedReviewFeedback();
    }
  });
  const ddato = new Date();
  console.log('reviewFeedbackCSV:', ddato.getMinutes(), ddato.getSeconds());
};

const productsCSV = () => {
  const dato = new Date();
  console.log('productsCSV:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('productsTable.csv', productsTable(0, chunk), (err) => {
    if (err) throw err;
  });
  fs.writeFile('productsTable2.csv', (err) => console.log(err));
  let count = 1;
  for (let i = chunk; i < productRecords; i += chunk) {
    const init = (count + 1) * chunk;
    if ((i <= 5000000) && (i % chunk === 0)) {
      fs.appendFile('productsTable.csv', productsTable(i, init), (err) => console.log(err));
      count++;
    }
    if ((i > 5000000) && (i % chunk === 0)) {
      fs.appendFile('productsTable2.csv', productsTable(i, init), (err) => {
        if (err) {
          console.log('err');
        }
        if (i === 9999999) {
          seedProducts();
        }
      });
      count++;
      // console.log('productsTable2.csv: ', i, init);
    }
  }
  const ddato = new Date();
  console.log('productsCSV:', ddato.getMinutes(), ddato.getSeconds());
};

const seedCSV = () => {
  usersCSV();
  productsCSV();
  // reviewCSV1();
  // reviewFeedbackCSV();
};

seedCSV();