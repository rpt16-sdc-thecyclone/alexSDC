const { Pool } = require('pg');
const csv = require('csvtojson');

const client = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'aldwallis',
  database: 'review1',
});


const getUsers = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('SELECT * FROM users;')
          .then((r) => resolve(r.rows));
      });
  });
};

let getRatings = (productId) => {
  return new Promise((resolve) => {
    // Got rid of a client.connect() and number of requests I could process went from 9 to ? (>9)
    const obj = {};
    client.query(`SELECT seller, prop1, prop2, prop3, productCondition from products WHERE id=${productId}`)
      .then((result) => {
        obj.reviews = result.rows;
        // Changed past isProductPropGood(1)Good to removing a isProductProp(1)Good
        client.query(`SELECT id, ratings, productId, isProductProp1Good, isProductProp2Good, isProductProp3Good from reviews WHERE productId=${productId}`)
          .then((rez) => {
            obj.productDetails = rez.rows;
            resolve(obj);
          });
      });
  });
};

/**
 * Index Scan using productsidindex on products  (cost=0.43..8.45 rows=1 width=51) (actual time=0.040..0.040 rows=1 loops=1)
   Index Cond: (id = 2)
    Planning Time: 2.326 ms
    Execution Time: 0.062 ms
 */


const getReviews = (productId, offset, limit) => {
  return new Promise((resolve) => {
    const reviewsData = client.query(`SELECT
    reviews.id, reviews.ratings, reviews.title, reviews.description, reviews.report_abuse, reviews.created_on, reviews.productId, reviewFeedback.isHelpful, users.names
    FROM reviews
    JOIN reviewFeedback ON reviews.id=reviewFeedback.reviewId
    JOIN users ON reviews.userId=users.id
    WHERE reviews.productId=${productId}`);

    // Seems like offset is bad for performance?
    // try this later

    const productsData = client.query(`SELECT
    seller, productCondition
    FROM products
    WHERE id=${productId}
    `);

    Promise.all([reviewsData, productsData])
      .then((res) => resolve({ reviews: res[0].rows, productDetails: res[1].rows }))
      .catch((err) => console.error('err: ', err));
  });
};

/**
 * getReviews: (productId, pagingAndSorting, callback) => {
    const p1 = db.Review.findAll({
      offset: pagingAndSorting.offset,
      limit: pagingAndSorting.limit,
      attributes: ['id', 'ratings', 'title', 'description', 'report_abuse', 'created_on', 'productId'],
      include: [{
        model: db.ReviewFeedback,
        attributes: ['isHelpful'],
        where: { reviewId: db.Sequelize.col('reviews.id') }
      },
      {
        model: db.User,
        attributes: ['name'],
        where: { userId: db.Sequelize.col('user.id') }
      }],
      order : [['created_on', 'DESC']],
      where: {
        productId
      }
    });
    const p2 = db.Product.findOne({
      attributes: ['seller', 'productCondition'],
      where: {
        id: productId
      }
    });
    Promise.all([p1, p2])
      .then((res) => { callback(null, { reviews: res[0], productDetails: res[1] }); })
      .catch((err) => { console.log('controller.js Promise: ',err); callback(err); });
  },
 */






















let getProducts = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('SELECT * FROM products;')
          .then((r) => resolve(r.rows));
      });
  });
};

let getReview = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('SELECT * FROM reviews;')
          .then((r) => resolve(r.rows));
      });
  });
};

let getFeedback = () => {
  return new Promise((resolve) => {
    client.connect()
      .then(() => {
        client.query('SELECT * FROM reviewfeedback;')
          .then((r) => resolve(r.rows));
      });
  });
};

module.exports = { getUsers, getProducts, getReview, getFeedback, getRatings, getReviews }