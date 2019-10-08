const db = require('../models/index.js');
const UserMockData = require('./usersMockData.js');
const productSampleData = require('./productSampleData.js');
const reviewsSampleData = require('./reviewsSampleData.js');
const feedBackSampleData = require('./feedBackSampleData.js');
const imageSampleData = require('./imageSampleData.js');

db.sequelize
  .query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
  .then(() => db.sequelize.sync({ force: true }))
  .then(() => db.User.bulkCreate(UserMockData))
  .then(() => db.Product.bulkCreate(productSampleData))
  .then(() => db.Review.bulkCreate(reviewsSampleData))
  .then(() => db.ReviewFeedback.bulkCreate(feedBackSampleData))
  .then(() => db.ReviewImage.bulkCreate(imageSampleData))
  .then(() => {
    db.sequelize.close();
  })
  .catch((err) => {
    console.error('Error in creating database', err);
  });
