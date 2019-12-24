/* eslint-disable no-console */
const fs = require('fs');
const fsPromise = require('fs').promises;
// eslint-disable-next-line object-curly-newline
const { usersTable, Review, ReviewFeedbacks, productsTable } = require('./fakerData');
const { seedUsers, seedReviewFeedback, seedProducts, seedReview1, seedReview2, creatingTables, main, productSample } = require('./postgreSQL');

const chunk = 100000;
// const maxRecords = 10000000;
const productRecords = 10000000;
const review1Records = 7500000;
const review2Records = 15000000;


// If i do writeFileSync the function won't resolve.
const usersCSV = () => {
  return new Promise((resolve) => {
    const dato = new Date();
    console.log('userCSV start:', dato.getMinutes(), dato.getSeconds());
    fs.writeFile('userTable.csv', usersTable(), (err) => {
      if (err) {
        throw err;
      } else {
        const ddato = new Date();
        console.log('userCSV end:', ddato.getMinutes(), ddato.getSeconds());
        // resolve(seedUsers());
        resolve();
      }
    });
  });
};

/**
 * Able to do 7.5m records w/ 100k chunk w/ appendFileSync in 34s.
 *  First time testing today
 * Able to do reviewCSV1.then((reviewCSV2())) w/ CSV2 same specs as above & no postgres w/review1
 *  -5:45
 * Did reviewCSV1() and called reviewCSV2() right after, same specs as above
 *  -4m5s
 * reviewCSV2 w/ 3 createWriteStreams, where we just use write(Review(i, init)), same other specs
 *  -30s
 * Did reviewCSV1() and called reviewCSV2() right after, same specs as above
 *  -5:49
 * Did reviewsCSV1().then((reviewCSV2())) w/ same specs as above
 *  -5:26
 *  - I think promise w/ write streams is the way to go.
 * Did reviewCSV1.then((reviewCSV2)), got rid of async/changed to promise, resolved at seedReview
 *  -13m13s, finished CSV1 in 1m13s, finished CSV1andCSV2 in 6m
 *  -review1 was still appendFile, review2 was fs.createWriteStream, write
 * Did reviewCSV1.then((reviewCSV2)), got rid of async/changed to promise, resolved at seedReview
 *  -review1 is appendFile, review2 is appenfilesync
 *  -11m30s. finished CSV1andCSV2 in 4:17, so looks like postgres is limiting factor.
 */

const reviewCSV2 = () => {
  return new Promise((resolve) => {
    const dato = new Date();
    console.log('reviewCSV2:', dato.getMinutes(), dato.getSeconds());
    let count = 75;
    for (let i = 7500000; i < review2Records; i += chunk) {
      const init = (count + 1) * chunk;
      if ((i < 10000000) && (i % chunk === 0)) {
        fs.appendFileSync('reviewTable4.csv', Review(i, init), (err) => {
          if (err) throw err;
        });
        // rT4.write(Review(i, init), (err) => {
        //   if (err) throw err;
        // });
        count++;
      }
      if (i === 10000000) {
        // console.log('1/3, thorough, need for seed 2');
        // resolve(seedReview2());
        resolve();
      }
      if ((i >= 10000000 && i < 12500000) && (i % chunk === 0)) {
        fs.appendFileSync('reviewTable5.csv', Review(i, init), (err) => {
          if (err) throw err;
        });
        // rT5.write(Review(i, init), (err) => {
        //   if (err) throw err;
        // });
        count++;
      }
      if (i >= 12500000 && (i % chunk === 0)) {
        fs.appendFileSync('reviewTable6.csv', Review(i, init), (err) => {
          if (err) throw err;
        });
        // rT6.write(Review(i, init), (err) => {
        //   if (err) throw err;
        // });
        count++;
      }
    }
    // Help w/ memory??
    count = undefined;
    const ddato = new Date();
    console.log('reviewCSV2:', ddato.getMinutes(), ddato.getSeconds());
  })
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
 *
 *  Did reviewsCSV, changed it to async/got rid of promise and awaited seedReview
 *  -5m31s
 *  Did reviewCSV, got rid of async/changed to promise, resolved at null at end.
 *  -5m19s
 *  Did reviewCSV, got rid of async/changed to promise, resolved at seedReview
 *  -Computer crashed 2x
 * */
const reviewCSV1 = () => {
  return new Promise((resolve) => {
    const dato = new Date();
    console.log('reviewCSV1:', dato.getMinutes(), dato.getSeconds());
    fs.writeFileSync('reviewTable1.csv', Review(0, chunk), (err) => {
      if (err) throw err;
    });
    let count = 1;
    for (let i = chunk; i < review1Records; i += chunk) {
      const init = (count + 1) * chunk;
      if ((i < 2500000) && (i % chunk === 0)) {
        // console.log(i, init);
        fs.appendFileSync('reviewTable1.csv', Review(i, init), (err) => {
          if (err) throw err;
        });
        count++;
      }
      if (i === 2500000) {
        console.log('1/3, thorough, need for seed');
        // resolve(seedReview1());
        resolve();
      }
      if ((i >= 2500000 && i < 5000000) && (i % chunk === 0)) {
        fs.appendFileSync('reviewTable2.csv', Review(i, init), (err) => {
          if (err) throw err;
        });
        count++;
      }
      if (i >= 5000000 && (i % chunk === 0)) {
        fs.appendFileSync('reviewTable3.csv', Review(i, init), (err) => {
          if (err) throw err;
        });
        count++;
      }
    }
    const ddato = new Date();
    console.log('reviewCSV1:', ddato.getMinutes(), ddato.getSeconds());
    // Maybe help w/ memory??
    count = undefined;
  });
};

const reviewFeedbackCSV = () => {
  return new Promise((resolve) => {
    const dato = new Date();
    console.log('reviewFeedbackCSV:', dato.getMinutes(), dato.getSeconds());
    fs.writeFile('reviewFeedbackCSV.csv', ReviewFeedbacks(), (err) => {
      if (err) {
        throw err;
      } else {
        // resolve(seedReviewFeedback());
        resolve();
      }
    });
    const ddato = new Date();
    console.log('reviewFeedbackCSV:', ddato.getMinutes(), ddato.getSeconds());
  })
};

// If I do appendFileSync instead of non-sync, more memory is freed up
// I think because reviews1 runs a lot quicker? Also added in count = undefined
// unsure if that helped.
let productsCSV = () => {
  return new Promise((resolve) => {
    const dato = new Date();
    console.log('productsCSV start:', dato.getMinutes(), dato.getSeconds());
    fs.writeFileSync('productsTable.csv', productsTable(0, chunk), (err) => {
      if (err) throw err;
    });
    let count = 1;
    // remember to return it back to productRecords
    for (let i = chunk; i < 6500000; i += chunk) {
      const init = (count + 1) * chunk;
      console.log(init, i);
      if ((i < 5000000) && (i % chunk === 0)) {
        fs.appendFileSync('productsTable.csv', productsTable(i, init), (err) => {
          if (err) throw err;
        });
        count++;
      }
      if (i === 5000000) {
        seedProducts();
      }
      if ((i >= 5000000) && (i % chunk === 0)) {
        fs.appendFileSync('productsTable2.csv', productsTable(i, init), (err) => {
          if (err) throw err;
        });
        count++;
      }
    }
    resolve();
    const ddato = new Date();
    count = undefined;
    console.log('productsCSV created:', ddato.getMinutes(), ddato.getSeconds());
  });
};

productsCSV();

const seedCSV = () => {
  creatingTables()
  .then(() => {
    reviewFeedbackCSV().then(() => {
      reviewCSV1().then(() => {
        reviewCSV2().then(() => {
          productsCSV().then(() => {
            usersCSV()
          })
        })
      })
    })
  })
  //.then(() => {
    // usersCSV().then(() => {
    //   productsCSV().then(() => {
    //     reviewCSV1().then(() => {
    //       reviewCSV2().then(() => {
    //         reviewFeedbackCSV().then(() => {
    //           main();
    //         })
    //       })
    //         .catch((err) => console.error('reviewCSV2 seedCSV', err));
    //     })
    //       .catch((err) => console.error('reviewCSV1 seedCSV:', err));
    //   })
    //     .catch((err) => console.error('productsCSV seedCSV:', err));
    // })
    //   .catch((err) => console.error('userCSV seedCSV:', err));
  // });
};

// seedCSV();

/**
 * userCSV and productsCSV both w/ individual postgres functions
 *  -4m13s
 * userCSV and productsCSV both w/ individual postgres functions
 *  -user postgres has client connect, products doesn't
 *  -3m27s
 */
