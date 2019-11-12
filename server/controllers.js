
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
      // {
      //   model: db.ReviewImage,
      //   attributes: ['imageUrl'],
      //   where: { reviewId: db.Sequelize.col('reviews.id') }
      // }, 
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
      .catch((err) => { console.log(err); callback(err); });
  }
}