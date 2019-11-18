
const db = require('./db/models/index.js');

module.exports = {
  getAllRatings: (productId, callback) => {
    const p1 = db.Review.findAll({
      attributes: ['id', 'ratings', 'productId', 'isProductProp1Good', 'isProductProp2Good', 'isProductProp3Good'],
      where: {
        productId
      }
    });
    const p2 = db.Product.findOne({
      attributes: ['seller', 'prop1', 'prop2', 'prop3', 'productCondition'],
      where: {
        id: productId
      }
    });
    Promise.all([p1, p2])
      .then((res) => { callback(null, { reviews: res[0], productDetails: res[1] }); })
      .catch((err) => { console.log(err); callback(err); });
  },

  getRatings: () => {
    return new Promise((resolve, reject) => {
      db.Review.findAll({
        attributes: ['id', 'ratings', 'productId', 'isProductProp1Good', 'isProductProp2Good', 'isProductProp3Good'],
      })
      .then(all => {
        //console.log('db.Review.findAll: ',all);
        resolve(all);
      })
      .catch(err => {
        //console.error('db.Review.findAll: ',err);
        reject(err);
      });
    })
  },

  getReviews1: () => {
    return new Promise((resolve, reject) => {
      db.Review.findAll({
        attributes: ['id', 'ratings', 'title', 'description', 'report_abuse', 'created_on', 'productId'],
        offset: 5,
        //Limit works but currently the max w/ this innerjoin is 5.
        limit: 5,
        //I believe include works like an inner join? and here the primary key is id
        include: [{
          model: db.ReviewFeedback,
          attributes: ['isHelpful'],
          where: { reviewId: db.Sequelize.col('reviews.id') }
        },
        {
          model: db.User,
          attributes: ['name'],
          where: { userId: db.Sequelize.col('user.id') }
        }]
      })
      .then(result => {
        console.log('getReviews1: ',result);
        resolve(result);
      })
      .catch(error => {
        console.log('getReviews error: ',error);
        reject(error);
      })
    })
  },

  getReviews: (productId, pagingAndSorting, callback) => {
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
  }
}