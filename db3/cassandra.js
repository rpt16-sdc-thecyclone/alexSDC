/* eslint-disable quotes */
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1' });

// const query = 'SELECT name, email FROM users WHERE key=?';

client.connect().then((err) => {
  if (err) throw err;
  else console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
});

const databaseAndTableSetUp = () => {
  const keyspaceQuery = `CREATE KEYSPACE IF NOT EXISTS review1 WITH REPLICATION = {'class':'SimpleStrategy', 'replication_factor':1}`;
  const usersTable = 'CREATE TABLE IF NOT EXISTS review1.userTable (id int PRIMARY KEY, names text)';
  const productsTable = 'CREATE TABLE IF NOT EXISTS review1.productTable(id int PRIMARY KEY, name text, productCondition text, seller text, prop1 text, prop2 text, prop3 text)';
  const reviewTable = `CREATE TABLE IF NOT EXISTS review1.reviewTable(id int PRIMARY KEY, ratings int, title text, description text, report_abuse int,
  isProductPropGood1Good int, isProductPropGood2Good int, isProductPropGood3Good int, created_on text, userId int,
  productId int)`;
  const reviewFeedbackTable = 'CREATE TABLE IF NOT EXISTS review1.reviewFeedbackTable(id int PRIMARY KEY, isHelpful int, reviewId int, userId int)';

  client.execute(keyspaceQuery)
    .catch((err) => console.error(err));

  client.execute(usersTable)
    .catch((err) => console.error(err));

  client.execute(productsTable)
    .catch((err) => console.error(err));

  client.execute(reviewTable)
    .catch((err) => console.error(err));

  client.execute(reviewFeedbackTable)
    .catch((err) => console.error(err));
};

databaseAndTableSetUp();

const copy = () => {
  let userCopy = `COPY review1.userTable (id,names) FROM '../userTable.csv' WITH HEADER = FALSE`;
  client.execute(userCopy)
    .then((r) => console.log('finished ', r))
    .catch((err) => console.error(err));
};

const dropTable = (table) => {
  client.execute(`DROP TABLE review1.${table}`)
    .then((r) => console.log('dropped ', table, r))
    .catch((err) => console.log(err));
};

/**
 * client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, names jsonb not null)')
          .then(() => {
            client.query('CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY, name VARCHAR(100), productCondition VARCHAR(40), seller VARCHAR(100), prop1 VARCHAR(30), prop2 VARCHAR(30), prop3 VARCHAR(30))')
              .then(() => {
                client.query(`CREATE TABLE IF NOT EXISTS reviews(id SERIAL PRIMARY KEY, ratings INTEGER, title VARCHAR(200), description VARCHAR(200), report_abuse INTEGER,
                  isProductPropGood1Good INTEGER, isProductPropGood2Good INTEGER, isProductPropGood3Good INTEGER, created_on VARCHAR(40), userId INTEGER REFERENCES users(id),
                  productId INTEGER REFERENCES products(id))`)
                  .then(() => {
                    client.query('CREATE TABLE IF NOT EXISTS reviewFeedback(id SERIAL PRIMARY KEY, isHelpful INTEGER, reviewId INTEGER, userId INTEGER)')

 */
/** Cassandra Notes
 * keyspace is synonymous with a database
 *  -keyspace defines how many times the data is replicated, and in what datacenters the data resides.
 *  -In every keyspace there is a set of column families.
 * A column family is like a table in an RDBMS,
 * -however, there is no set schema.
 * -While you can specify the value type for a specific column, this can also be done on the fly.
 * -Each column family has a set of rows, which consist of columns.
 * -Every column is a tuple that contains the column name, value, time stamp, a
 * https://www.tutorialspoint.com/cassandra/cassandra_data_model.htm
 *
 */