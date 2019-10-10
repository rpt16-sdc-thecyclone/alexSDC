
const db = require('./db/models/index.js');

module.exports = {
  getReviews: (productId, callback) => {
    const p1 = db.Review.findAll({
      attributes: ['id', 'ratings', 'title', 'description', 'report_abuse', 'created_on', 'productId', 'isProductProp1Good', 'isProductProp2Good', 'isProductProp3Good'],
      include: [{
        model: db.ReviewFeedback,
        attributes: ['isHelpful'],
        where: { reviewId: db.Sequelize.col('reviews.id') } 
      }, {
        model: db.ReviewImage,
        attributes: ['imageUrl'],
        where: { reviewId: db.Sequelize.col('reviews.id') }
      }],
      where: {
        productId
      }
    });
    const p2 = db.Product.findOne({
      attributes: ['seller', 'prop1', 'prop2', 'prop3'],
      where: {
        id: productId
      }
    });
    Promise.all([p1, p2])
      .then((res) => { callback(null, { reviews: res[0], productDetails: res[1] }); })
      .catch((err) => { console.log(err); callback(err); });
  }
}
