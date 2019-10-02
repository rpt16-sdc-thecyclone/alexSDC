
/******This file is just for schema reference******/

DROP DATABASE IF EXISTS ratings_and_reviews;
CREATE DATABASE ratings_and_reviews;
use ratings_and_reviews;
DROP TABLE IF EXISTS review_feedbacks;
DROP TABLE IF EXISTS review_images;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE products (
  id int NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  product_condition ENUM('used','new'),
  seller VARCHAR(255) NOT NULL,
  prop1 VARCHAR(50) NOT NULL,
  prop2 VARCHAR(50) NOT NULL,
  prop3 VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE reviews (
  id int NOT NULL AUTO_INCREMENT,
  ratings int NOT NULL,
  title VARCHAR(255),
  description VARCHAR(2000),
  product_id int NOT NULL,
  user_id int NOT NULL UNIQUE,
  report_abuse BOOLEAN,
  isProductProp1Good BOOLEAN,
  isProductProp2Good BOOLEAN,
  isProductProp3Good BOOLEAN,
  created_on datetime default CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE review_feedbacks (
  id int NOT NULL AUTO_INCREMENT,
  review_id int,
  user_id int,
  isHelpful boolean,
  PRIMARY KEY (id),
  FOREIGN KEY (review_id) REFERENCES reviews(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE review_images (
  id int NOT NULL AUTO_INCREMENT,
  review_id int,
  image_url VARCHAR(100),
  PRIMARY KEY (id),
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);

