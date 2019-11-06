const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../config/config.json')[env];
let sequelize = new Sequelize(config.database, config.username, config.password, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  operatorsAliases: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('users', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, { timestamps: false });

const Product = sequelize.define('products', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  productCondition: {
    type: Sequelize.ENUM('new', 'used'),
    allowNull: false
  },
  seller: {
    type: Sequelize.STRING,
    allowNull: false
  },
  prop1: Sequelize.STRING,
  prop2: Sequelize.STRING,
  prop3: Sequelize.STRING
}, { timestamps: false });


const Review = sequelize.define('reviews', {
  ratings: { type: Sequelize.INTEGER, allowNull: false },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING(2000), allowNull: false },
  report_abuse: { type: Sequelize.BOOLEAN, allowNull: false },
  isProductProp1Good: { type: Sequelize.BOOLEAN, allowNull: false },
  isProductProp2Good: { type: Sequelize.BOOLEAN, allowNull: false },
  isProductProp3Good: { type: Sequelize.BOOLEAN, allowNull: false },
  created_on: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
}, { timestamps: false });


const ReviewFeedback = sequelize.define('ReviewFeedback', {
  reviewId: { type: Sequelize.INTEGER, allowNull: false },
  userId: { type: Sequelize.INTEGER, allowNull: false },
  isHelpful: { type: Sequelize.BOOLEAN, allowNull: false },
}, { timestamps: false });


const ReviewImage = sequelize.define('ReviewImage', {
  imageUrl: { type: Sequelize.STRING, allowNull: false },
}, { timestamps: false });


User.hasMany(Review);
Review.belongsTo(User);
Product.hasMany(Review);
Review.belongsTo(Product);

Review.hasMany(ReviewFeedback);
ReviewFeedback.belongsTo(Review);

User.hasMany(ReviewFeedback);
ReviewFeedback.belongsTo(User);

Review.hasMany(ReviewImage);
ReviewImage.belongsTo(Review);
//sequelize.sync();

module.exports = {
  Sequelize,
  sequelize,
  User,
  Review,
  ReviewFeedback,
  ReviewImage,
  Product
};
