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

const goalRecords = 1000000;

const usersTable = () => {
  let usersArray = '';
  // shouldn't matter we start id @ 0 instead of 1;
  for (let i = 0; i < goalRecords; i++) {
    usersArray += `${i.toString()},`;
    usersArray += (`"${Faker.name.firstName()} ${Faker.name.lastName()}"`);
    usersArray += '\n';
  }
  // console.log('user: ', usersArray);
  return usersArray;
};

const productsTable = () => {
  let productsArray = '';
  for (let i = 0; i < goalRecords; i++) {
    productsArray += `${i.toString()},`;
    // productsArray += (`${JSON.stringify(Faker.commerce.productName())},`);
    productsArray += "'" + Faker.commerce.productName() + "',";
    productsArray += (i % 2 === 0 ? ("'used',") : ("'new',"));
    // Changed from company name to streetname b/c c names had commas in it
    // and would mess up delimiter ','
    // productsArray += (`${JSON.stringify(Faker.address.streetName())},`);
    productsArray += "'" + Faker.address.streetName() + "',";
    productsArray += "'" + Faker.commerce.productAdjective() + "',";
    productsArray += "'" + Faker.commerce.productAdjective() + "',";
    productsArray += "'" + Faker.commerce.productAdjective() + "'";
    // productsArray += (`${JSON.stringify(Faker.commerce.productAdjective())},`);
    // productsArray += (`${JSON.stringify(Faker.commerce.productAdjective())},`);
    // productsArray += (`${JSON.stringify(Faker.commerce.productAdjective())}`);
    productsArray += '\n';
    // const obj = {};
    // obj.id = i.toString();
    // obj.name = Faker.commerce.productName();
    // obj.productCondition = i % 2 === 0 ? 'used,' : 'new,';
    // obj.seller = Faker.company.companyName();
    // obj.prop1 = Faker.commerce.productAdjective();
    // obj.prop2 = Faker.commerce.productAdjective();
    // obj.prop3 = Faker.commerce.productAdjective();
    // productsArray.push(obj);
  }
  return productsArray;
};

const ReviewFeedbacks = () => {
  let reviewFeedbacksArray = '';
  for (let i = 0; i < goalRecords; i++) {
    const iString = `${i.toString()},`;
    reviewFeedbacksArray += iString;
    reviewFeedbacksArray += iString;
    reviewFeedbacksArray += iString;
    reviewFeedbacksArray += (i % 2 === 0 ? '1' : '0');
    reviewFeedbacksArray += '\n';
    // const obj = {};
    // obj.id = i.toString();
    // obj.reviewId = i.toString();
    // obj.userId = i.toString();
    // obj.isHelpful = i % 2 === 0 ? '1' : '0';
    // reviewFeedbacksArray.push(obj);
  }
  // console.log('reviewFeedback: ', reviewFeedbacksArray);
  return reviewFeedbacksArray;
};

// batch inserts?

const Review = (init, end) => {
  let reviewArray = '';
  const currentDate = new Date();
  const dateStr = currentDate.toISOString();
  for (let i = init; i < end; i++) {
    const evenOdd = (i % 2 === 0 ? '0,' : '1,');
    const iString = `${i.toString()},`;
    reviewArray += iString;
    reviewArray += `${Math.floor(Math.random() * 5)},`;
    // reviewArray += (`${Faker.company.catchPhrase())} ,`);
    // reviewArray += (`${JSON.stringify(Faker.company.catchPhrase())},`);
    reviewArray += "'" + Faker.company.catchPhrase() + "',";
    // reviewArray += (`${JSON.stringify(Faker.lorem.sentence())},`);
    reviewArray += "'" + Faker.lorem.sentence() + "',";
    reviewArray += evenOdd;
    reviewArray += evenOdd;
    reviewArray += evenOdd;
    reviewArray += evenOdd;
    // reviewArray += `${JSON.stringify(currentDate.toISOString())},`;
    reviewArray += "'" + dateStr + "',";
    reviewArray += iString;
    reviewArray += `${i.toString()}`;
    reviewArray += '\n';
    // const obj = {};
    // obj.id = i.toString();
    // obj.ratings = Math.floor(Math.random() * 5);
    // obj.title = Faker.company.catchPhrase();
    // obj.description = Faker.lorem.sentence();
    // obj.report_abuse = i % 2 === 0 ? '0' : '1';
    // obj.isProductProp1Good = i % 2 === 0 ? '0' : '1';
    // obj.isProductProp2Good = i % 2 === 0 ? '0' : '1';
    // obj.isProductProp3Good = i % 2 === 0 ? '0' : '1';
    // obj.created_on = currentDate.toISOString();
    // obj.userId = i;
    // obj.productId = i;
    // reviewArray.push(obj);
  }
  return reviewArray;
};

module.exports = {
  Review, ReviewFeedbacks, productsTable, usersTable,
};