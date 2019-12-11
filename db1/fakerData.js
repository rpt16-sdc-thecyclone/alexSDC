/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/**
 * Fake data for:
 *  users table:
 *    -id: starting at 1 in increasing order
 *    -names: first and last
 *  reviews table:
 *    -id: start at 1 in increasing order
 *    -ratings: out of 5?
 *    -title: Blurb of review i.e. subject in email
 *    -description: actual review
 *    -report abuse: 0 or 1 for true or false.
 *    -isProductPropGood1Good: 0 or 1 for true or false (correlates to product table's prop1)
 *    -isProductPropGood2Good: 0 or 1 for true or false (correlates to product table's prop2)
 *    -isProductPropGood3Good: 0 or 1 for true or false (correlates to product table's prop3)
 *    -created_on: date record updated/created?
 *    -userId: correlates to an id on user table's id
 *    -productId: correlates to an id on product table's id
 *  ReviewFeedbacks table;
 *    -id: start @ 1
 *    -reviewId: refers to id on reviews table;
 *    -userId: refers to id on user table
 *    -isHelpful: 0 or 1 for true/false
 *  Products table;
 *    -id: start @ 1
 *    -name: name of product;
 *    -productCondition: either new or used;
 *    -seller: kinda random names could do first+last or company names;
 *    -prop1: A characteristic about the product, she cycles between 2 different one for this column
 *    -prop2: A characteristic about the product, she cycles between 2 different one for this column
 *    -prop3: A characteristic about the product, she cycles between 2 different one for this column
 */
const Faker = require('faker');

// const goalRecords = 1000000;
const userRecords = 2500000;
const reviewsRecords = 2500000;
// const reviewFeedbackRecords = 20000000;
const productNameArray = ['Multi-layered actuating protocol', 'Compatible real-time definition', 'Secured even-keeled project', 'Distributed human-resource circuit',
  'Synergized heuristic alliance', 'Persistent value-added strategy', 'Digitized secondary database', 'Open-architected multi-tasking challenge', 'Object-based cohesive utilisation'
];
const adjectiveArray = ['cool', 'small', 'large', 'tall', 'substantive', 'unimpressive', 'life-like', 'colorful', 'statue-esque', 'happy-go-lucky'];
const catchPhrase = ['Profit-focused context-sensitive policy', 'Multi-layered bi-directional matrices', 'Cross-group maximized flexibility', 'Phased attitude-oriented hardware',
  'Persistent scalable synergy', 'Profit-focused leading edge forecast', 'Synchronised empowering task-force', 'Pre-emptive exuding function', 'Synergistic multimedia support', 'Persistent transitional utilisation',
];

const usersTable = () => {
  let usersArray = '';
  // shouldn't matter we start id @ 0 instead of 1;
  for (let i = 0; i < userRecords; i++) {
    usersArray += `${i.toString()},`;
    usersArray += (`"${Faker.name.firstName()} ${Faker.name.lastName()}"`);
    usersArray += '\n';
  }
  // console.log('user: ', usersArray);
  return usersArray;
};

/**
 *
 Running productsTable by itself.
  w/ if statement and adjectiveArray[onesplace]
    5m records 26s
  w/ no if statement and Faker.commerce.productAdjective()
    5m records 39seconds;
  w/ no if statement and adjectiveArray[Math.random() * 10]
    5m records 35seconds;
 */

const productsTable = (init, end) => {
  let productsArray = '';
  for (let i = init; i < end; i++) {
    let onesplace = `${i}`.slice(-1);
    if (onesplace == 9 || onesplace == 1) {
      onesplace = 2;
      productsArray += `${i.toString()},`;
      productsArray += "'" + productNameArray[onesplace] + "',";
      productsArray += (i % 2 === 0 ? ("'used',") : ("'new',"));
      // Changed from company name to streetname b/c c names had commas in it
      // and would mess up delimiter ','
      productsArray += "'" + adjectiveArray[onesplace - 1] + "',";
      productsArray += "'" + adjectiveArray[onesplace] + "',";
      productsArray += "'" + adjectiveArray[onesplace + 1] + "'";
      productsArray += '\n';
    } else {
      productsArray += `${i.toString()},`;
      productsArray += "'" + productNameArray[onesplace] + "',";
      productsArray += (i % 2 === 0 ? ("'used',") : ("'new',"));
      // Changed from company name to streetname b/c c names had commas in it
      // and would mess up delimiter ','
      productsArray += "'" + Faker.address.streetName() + "',";
      // math random to onesplace
      productsArray += "'" + adjectiveArray[onesplace] + "',";
      productsArray += "'" + adjectiveArray[onesplace] + "',";
      productsArray += "'" + adjectiveArray[onesplace] + "'";
      productsArray += '\n';
    }
  }
  return productsArray;
};

const ReviewFeedbacks = () => {
  let reviewFeedbacksArray = '';
  for (let i = 0; i < reviewFeedbackRecords; i++) {
    const iString = `${i.toString()},`;
    reviewFeedbacksArray += iString;
    reviewFeedbacksArray += iString;
    reviewFeedbacksArray += iString;
    reviewFeedbacksArray += (i % 2 === 0 ? '1' : '0');
    reviewFeedbacksArray += '\n';
  }
  return reviewFeedbacksArray;
};

// batch inserts?

/**
 *
    1m records w/ 2 reference to Math.floor -40sec
    1m records w/ 1 ref to math floor -38sec
    1m records w/ change to catchPhrase array - 3sec
 */
const Review = (init, end) => {
  let reviewArray = '';
  const currentDate = new Date();
  const date = currentDate.toISOString();
  for (let i = init; i < end; i++) {
    let onesplace = `${i}`.slice(-1);
    const num = `${Math.floor(Math.random() * 5)},`;
    if (onesplace == 9 || onesplace == 1) {
      onesplace = 2;
      const evenOdd = (i % 2 === 0 ? '0,' : '1,');
      const iString = `${i.toString()},`;
      reviewArray += iString;
      reviewArray += num;
      reviewArray += "'" + catchPhrase[onesplace] + "',";
      reviewArray += "'" + productNameArray[onesplace] + "',";
      reviewArray += evenOdd;
      reviewArray += evenOdd;
      reviewArray += evenOdd;
      reviewArray += evenOdd;
      reviewArray += "'" + date + "',";
      reviewArray += iString;
      reviewArray += `${i.toString()}`;
      reviewArray += '\n';
    } else {
      const evenOdd = (i % 2 === 0 ? '0,' : '1,');
      const iString = `${i.toString()},`;
      reviewArray += iString;
      reviewArray += num;
      reviewArray += "'" + catchPhrase[onesplace] + "',";
      reviewArray += "'" + productNameArray[onesplace] + "',";
      reviewArray += evenOdd;
      reviewArray += evenOdd;
      reviewArray += evenOdd;
      reviewArray += evenOdd;
      reviewArray += "'" + date + "',";
      reviewArray += iString;
      reviewArray += `${i.toString()}`;
      reviewArray += '\n';
    }
  }
  return reviewArray;
};

module.exports = {
  Review, ReviewFeedbacks, productsTable, usersTable,
};