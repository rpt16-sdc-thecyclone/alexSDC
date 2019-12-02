/* eslint-disable no-console */
const fs = require('fs');
const fsPromise = require('fs').promises;
// eslint-disable-next-line object-curly-newline
const { usersTable, Review, ReviewFeedbacks, productsTable } = require('./fakerData');

const chunk = 100000;
const maxRecords = 1000000;

const usersCSV = () => {
  const dato = new Date();
  console.log('userCSV:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('userTable.csv', usersTable());
  const ddato = new Date();
  console.log('userCSV:', ddato.getMinutes(), ddato.getSeconds());
};


const reviewCSV1 = () => {
  const dato = new Date();
  console.log('reviewCSV1:', dato.getMinutes(), dato.getSeconds());
  // fs.writeFile('reviewTable1.csv', Review());
  fs.writeFile('reviewTable1.csv', Review(0, chunk));
  // want to write a file where we create 10 chunks of 100k records
  let count = 1;
  for (let i = chunk; i < maxRecords; i += chunk) {
    const init = (count + 1) * chunk;
    if (i % chunk === 0) {
      fs.appendFile('reviewTable1.csv', Review(i, init));
      console.log(i, init);
      count++;
    }
  }
  const ddato = new Date();
  console.log('reviewCSV1:', ddato.getMinutes(), ddato.getSeconds());
};

const reviewFeedbackCSV = () => {
  const dato = new Date();
  console.log('reviewFeedbackCSV:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('reviewFeedbackCSV.csv', ReviewFeedbacks());
  const ddato = new Date();
  console.log('reviewFeedbackCSV:', ddato.getMinutes(), ddato.getSeconds());
};

const productsCSV = () => {
  const dato = new Date();
  console.log('productsCSV:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('productsTable.csv', productsTable());
  const ddato = new Date();
  console.log('productsCSV:', ddato.getMinutes(), ddato.getSeconds());
};

const seedCSV = () => {
  usersCSV();
  reviewFeedbackCSV();
  productsCSV();
  reviewCSV1();
};

seedCSV();