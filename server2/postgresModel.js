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
  /**
   * SELECT reviews.id, reviews.ratings, reviews.productId, reviews.isProductProp1Good, reviews.isProductProp2Good, reviews.isProductProp3Good,
    products.seller, products.prop1, products.prop2, products.prop3, products.productCondition
    FROM reviews
    JOIN products ON reviews.productID=products.id
    WHERE reviews.productID=3;
   */
  return new Promise((resolve) => {
    client.query(`SELECT reviews.id, reviews.ratings, reviews.productId, reviews.isProductProp1Good, reviews.isProductProp2Good, reviews.isProductProp3Good,
    products.seller, products.prop1, products.prop2, products.prop3, products.productCondition
    FROM reviews
    JOIN products ON reviews.productID=products.id
    WHERE reviews.productID=${productId}`)
      .then((res) => resolve(res.rows));
  });
  // return new Promise((resolve) => {
  //   // Got rid of a client.connect() and number of requests I could process went from 9 to ? (>9)
  //   const obj = {};
  //   client.query(`SELECT seller, prop1, prop2, prop3, productCondition from products WHERE id=${productId}`)
  //     .then((result) => {
  //       obj.reviews = result.rows;
  //       // Changed past isProductPropGood(1)Good to removing a isProductProp(1)Good
  //       client.query(`SELECT id, ratings, productId, isProductProp1Good, isProductProp2Good, isProductProp3Good from reviews WHERE productId=${productId}`)
  //         .then((rez) => {
  //           obj.productDetails = rez.rows;
  //           resolve(obj);
  //         });
  //     });
  // });
};

/**
 * review1=# EXPLAIN ANALYZE SELECT id, ratings, productId, isProductProp1Good, isProductProp2Good, isProductProp3Good from reviews WHERE productId=3;
 *
 * Index Scan using productsidindex on products  (cost=0.43..8.45 rows=1 width=51) (actual time=0.040..0.040 rows=1 loops=1)
   Index Cond: (id = 2)
    Planning Time: 2.326 ms
    Execution Time: 0.062 ms


  EXPLAIN ANALYZE SELECT seller, prop1, prop2, prop3, productCondition from products WHERE id=2;

   Index Scan using productsidindex on products  (cost=0.43..8.45 rows=1 width=51) (actual time=0.138..0.139 rows=1 loops=1)
   Index Cond: (id = 2)
 Planning Time: 2.107 ms
 Execution Time: 0.574 ms


 EXPLAIN ANALYZE SELECT reviews.id, reviews.ratings, reviews.productId, reviews.isProductProp1Good, reviews.isProductProp2Good, reviews.isProductProp3Good,
products.seller, products.prop1, products.prop2, products.prop3, products.productCondition
FROM reviews
JOIN products ON reviews.productID=products.id
WHERE reviews.productID=3;

 Nested Loop  (cost=0.87..34.46 rows=6 width=67) (actual time=0.064..0.071 rows=6 loops=1)
   ->  Index Scan using productsidindex on products  (cost=0.43..8.45 rows=1 width=55) (actual time=0.039..0.039 rows=1 loops=1)
         Index Cond: (id = 3)
   ->  Index Scan using reviewsproductid on reviews  (cost=0.43..25.95 rows=6 width=16) (actual time=0.021..0.026 rows=6 loops=1)
         Index Cond: (productid = 3)
 Planning Time: 2.922 ms
 Execution Time: 0.744 ms

 */


const getReviews = (productId, offset, limit) => {
  return new Promise((resolve) => {
    const reviewsData = client.query(`SELECT
    reviews.id, reviews.ratings, reviews.title, reviews.description, reviews.report_abuse, reviews.created_on, reviews.productId, reviewFeedback.isHelpful AS ReviewFeedbacks, users.names AS user
    FROM reviews
    JOIN reviewFeedback ON reviews.id=reviewFeedback.reviewId
    JOIN users ON reviews.userId=users.id
    WHERE reviews.productId=${productId}`);

    // Seems like offset is bad for performance?
    // try this later

    const productsData = client.query(`SELECT
    seller, productcondition
    FROM products
    WHERE id=${productId}
    `);

    Promise.all([reviewsData, productsData])
      .then((res) => {
        for (let i = 0; i < res[0].rows.length; i++) {
          let rF = [ res[0].rows[i].reviewfeedbacks ];
          let user = { name: res[0].rows[i].user };
          res[0].rows[i].user = user;
          res[0].rows[i].reviewfeedbacks = rF;
        }
        resolve({ reviews: res[0].rows, productDetails: res[1].rows[0] })
      })
      .catch((err) => console.error('getReviews err: ', err));
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

/**
 * EXPLAIN ANALYZES:
 *  Index Scan using reviewsproductid on reviews  (cost=0.43..25.95 rows=6 width=16) (actual time=0.077..0.086 rows=6 loops=1)
      Index Cond: (productid = 3)
    Planning Time: 6.790 ms
    Execution Time: 0.107 ms
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