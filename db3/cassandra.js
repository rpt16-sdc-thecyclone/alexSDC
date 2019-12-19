const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['localhost:9042'], localDataCenter: 'datacenter1' });

// const query = 'SELECT name, email FROM users WHERE key=?';

client.connect().then((err) => {
  if (err) throw err;
  else console.log('connected to cassandra');
});

/** Cassandra Notes
 * keyspace is synonymous with a database
 *  -keyspace defines how many times the data is replicated, and in what datacenters the data resides.
 *  -In every keyspace there is a set of column families.
 * A column family is like a table in an RDBMS,
 * -however, there is no set schema.
 * -While you can specify the value type for a specific column, this can also be done on the fly.
 * -Each column family has a set of rows, which consist of columns.
 * -Every column is a tuple that contains the column name, value, time stamp, a
 */