/* eslint-disable no-console */
const fs = require('fs');
const fsPromise = require('fs').promises;
// eslint-disable-next-line object-curly-newline
const { usersTable, Review, ReviewFeedbacks, productsTable } = require('./fakerData');
const { seedUsers, seedReviewFeedback, seedProducts, seedReview } = require('./postgreSQL');

const chunk = 100000;
// const maxRecords = 10000000;
const productRecords = 10000000;
const review1Records = 7500000;

const usersCSV = () => {
  const dato = new Date();
  console.log('userCSV start:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('userTable.csv', usersTable(), (err) => {
    if (err) {
      throw err;
    } else {
      const ddato = new Date();
      console.log('userCSV end:', ddato.getMinutes(), ddato.getSeconds());
      seedUsers();
    }
  });
};

/**
 * Chunks of 5000 w/ 15m records in 4CSV doesn't work.
 * 10m records w/ 4CSVs w/ seedReview() at 2.5m w/100k chunk
 *  -4m16s
 * 15m records w/ 6CSVs w/ seedReview() at 2.5m w/100k chunk
 * -nope
 * 15m records w/ 6CSVs w/ seedReview() at 2.5m w/50k chunk
 * -nope
 * 10m records w/ 4CSVS w/o seedReview at 2.5m w/100k chunk
 * -46s
 * For some reason takes much longer to get the last 2.5m records in
 * w/ 10m records w/4 CSVs w/100k chunk.
 * */
const reviewCSV1 = () => {
  const dato = new Date();
  console.log('reviewCSV1:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('reviewTable1.csv', Review(0, chunk), (err) => {
    if (err) throw err;
  });
  let count = 1;
  for (let i = chunk; i < review1Records; i += chunk) {
    const init = (count + 1) * chunk;
    if ((i < 2500000) && (i % chunk === 0)) {
      fs.appendFile('reviewTable1.csv', Review(i, init), (err) => {
        if (err) throw err;
      });
      count++;
    }
    if (i === 2500000) {
      console.log('1/4, thorough, need for seed');
      // seedReview();
    }
    if ((i >= 2500000 && i < 5000000) && (i % chunk === 0)) {
      fs.appendFile('reviewTable2.csv', Review(i, init), (err) => {
        if (err) throw err;
      });
      count++;
    }
    if (i >= 5000000 && (i % chunk === 0)) {
      fs.appendFile('reviewTable3.csv', Review(i, init), (err) => {
        if (err) throw err;
      });
      console.log('3', i, init);
      count++;
    }
  }
  const ddato = new Date();
  console.log('reviewCSV1:', ddato.getMinutes(), ddato.getSeconds());
};

const reviewCSV2 = () => {
  const dato = new Date();
  console.log('reviewCSV1:', dato.getMinutes(), dato.getSeconds());
  // fs.writeFile('reviewTable4.csv', Review(7500000, chunk), (err) => {
  //   if (err) throw err;
  // });
  let count = 75;
  for (let i = 7500000; i < 10000000; i += chunk) {
    const init = (count + 1) * chunk;
    if ((i <= 10000000) && (i % chunk === 0)) {
      console.log(i, init);
      fs.appendFile('reviewTable4.csv', Review(i, init), (err) => {
        if (err) throw err;
      });
      count++;
    }
    // const init = (count + 1) * chunk;
    // if ((i < 2500000) && (i % chunk === 0)) {
    //   fs.appendFile('reviewTable1.csv', Review(i, init), (err) => {
    //     if (err) throw err;
    //   });
    //   count++;
    // }
    // if (i === 2500000) {
    //   console.log('1/4, thorough, need for seed');
    //   // seedReview();
    // }
    // if ((i >= 2500000 && i < 5000000) && (i % chunk === 0)) {
    //   fs.appendFile('reviewTable2.csv', Review(i, init), (err) => {
    //     if (err) throw err;
    //   });
    //   count++;
    // }
    // if (i >= 5000000 && (i % chunk === 0)) {
    //   fs.appendFile('reviewTable3.csv', Review(i, init), (err) => {
    //     if (err) throw err;
    //   });
    //   console.log('3', i, init);
    //   count++;
    // }
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
  console.log('productsCSV initialized:', dato.getMinutes(), dato.getSeconds());
  fs.writeFile('productsTable.csv', productsTable(0, chunk), (err) => {
    if (err) throw err;
  });
  let count = 1;
  for (let i = chunk; i < productRecords; i += chunk) {
    const init = (count + 1) * chunk;
    if ((i < 5000000) && (i % chunk === 0)) {
      fs.appendFile('productsTable.csv', productsTable(i, init), (err) => {
        if (err) throw err;
      });
      count++;
    }
    if (i === 5000000) {
      seedProducts();
    }
    if ((i >= 5000000) && (i % chunk === 0)) {
      fs.appendFile('productsTable2.csv', productsTable(i, init), (err) => {
        if (err) throw err;
      });
      count++;
    }
  }
  const ddato = new Date();
  console.log('productsCSV created:', ddato.getMinutes(), ddato.getSeconds());
};

const seedCSV = () => {
  // usersCSV();
  // productsCSV();
  // reviewCSV1();
  reviewCSV2();
  // reviewFeedbackCSV();
};

seedCSV();