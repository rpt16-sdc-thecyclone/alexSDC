
const db = require('./db/models/index.js');

module.exports = {
  getRatings : (productId, callback) => {
    const p1 = db.Review.findAll({
      attributes: ['id', 'ratings', 'isProductProp1Good', 'isProductProp2Good', 'isProductProp3Good'],
      where: {
        productId
      }
    });
    const p2 = db.Product.findOne({
      attributes: ['prop1', 'prop2', 'prop3'],
      where: {
        id: productId
      }
    });
    console.log(p1);
    console.log(p2);
    Promise.all([p1, p2])
      .then((res) => { callback(null, res); })
      .catch((err) => { console.log(err); callback(err); });
      
  },

  getReviews : (productId, callback) => {
    const p1 = db.Review.findAll({
      attributes: ['id', 'ratings', 'title', 'description', 'report_abuse', 'created_on', 'productId'],
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
      attributes: ['seller'],
      where: {
        id: productId
      }
    });
    Promise.all([p1, p2])
      .then((res) => { callback(null, res); })
      .catch((err) => { console.log(err); callback(err); });
  }
}
