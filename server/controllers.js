
const db = require('./db/models/index.js');
const sequelize = require('./db/models/index.js').sequelize;
const seeding = require('./db/seeders/seed1.js');

// let seedAll = () => {
//   return new Promise((resolve,reject) => {
//     db.Review.findAll({
//       attributes: ['id', 'ratings', 'productId', 'isProductProp1Good', 'isProductProp2Good', 'isProductProp3Good'],
//     })
//     .then(result => {
//       if (result.length === 0){
//         console.log('Empty DB, going to re-seed')
//         resolve(seeding());
//       } else {
//         resolve('DB full')
//       }
//     })
//   })
// }

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

  getRatings1: () => {
    return new Promise((resolve, reject) => {
      db.Review.findAll({
        attributes: ['id', 'ratings', 'productId', 'isProductProp1Good', 'isProductProp2Good', 'isProductProp3Good'],
      })
      .then(r => {
        if (r.length > 0){
          resolve(r);
        } else {
          seeding.seed();
          //nice lil recursion
          this.getRatings();
        }
      })
      .catch(err => {
        reject(err);
      })
    })
  },

  updateUsers: (updateId, updateName) => {
    return new Promise((resolve, reject) => {
      //console.log(`updateUsers: ${updateName} ${updateId}`)
      sequelize.query(`UPDATE users SET name = '${updateName}' WHERE id = '${updateId}'`, {type: sequelize.QueryTypes.UPDATE})
      .then(([results, metadata]) => {
        metadata == 1 ? resolve(`updated id:${updateId} name is ${updateName}`) : console.log('didn\'t update');
      })
      .catch(err => {
        reject(err);
      })
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
        if (result.length === 0){
          seeding.seed();
          this.getReviews1
        } else {
          resolve(result);
        }
      })
      .catch(error => {
        console.log('getReviews error: ',error);
        reject(error);
      })
    })
  },

  deleteReviews1: () => {
    return new Promise((resolve, reject) => {
      let array = [];
      db.Review.destroy({where: {}})
      .then(() => {
        array.push('Deleted Reviews Table');
      })
      .then(() => {
        db.User.destroy({where: {}})
        .then(() => {
          array.push('Deleted User Table');
        })
        .then(() => {
          db.ReviewFeedback.destroy({where:{}})
          .then(()=> {
            array.push('Deleted ReviewFeedback Table');
          })
          .then(()=>{
            db.Product.destroy({where:{}})
            .then(() => {
              array.push('Deleted Product Table');
            })
            .then(() => {
              db.ReviewImage.destroy({where: {}})
              .then(() => {
                array.push('Deleted ReviewImage Table');
                resolve(array);
              })
            })
          })
        })
      })
    })
  }
}