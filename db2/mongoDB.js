/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
const { MongoClient } = require('mongodb');

const dbName = 'review1';
const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });

// Need to start mongo w/ mongod command. Or you get errors like below
// MongoNetworkError: failed to connect to server [localhost:27017] on first connect
// [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]

const emptyCollection = () => {
  return new Promise((resolve) => {
    const db = client.db(dbName);
    const productsTable = db.collection('productsTable');
    const reviewFeedback = db.collection('reviewFeedback');
    const reviewTable = db.collection('reviewTable');
    const userTable = db.collection('userTable');
    productsTable.deleteMany({}).then(() => {
      reviewFeedback.deleteMany({}).then(() => {
        reviewTable.deleteMany({}).then(() => {
          userTable.deleteMany({}).then(() => {
            resolve('deleted productsTable, deleted reviewFeedback, deleted reviewTable, deleted userTable.');
          })
            .catch((err) => console.error('userTable delete', err));
        })
          .catch((err) => console.error('reviewTable delete', err));
      })
        .catch((err) => console.error('reviewFeedback delete', err));
    })
      .catch((err) => console.error('productsTable delete', err));
  });
};

/**
 *
 * @param {string} c collection name
 * @param {integer} id specific id to test
 * returns console.log for collection.findOne({id})
 */
const findOne = (c, id) => {
  const db = client.db(dbName);
  const collection = db.collection(c);
  collection.findOne({ id })
    .then((res) => console.log(res))
    .catch((err) => console.error('findOne err:', err));
};

/**
 * @param {string} c = collection name
 *
 * console.log for collection.estimatedDocumentCount(), resolves at this too.
 */
const collectionLength = (c) => {
  return new Promise((resolve) => {
    const db = client.db(dbName);
    const collection = db.collection(c);
    collection.estimatedDocumentCount()
      .then((r) => {
        console.log(r);
        resolve(r);
      })
      .catch((err) => console.error('collectionLength error', err));
  });
};

client.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('successful connected to ', dbName);
    client.close();
  }
});
