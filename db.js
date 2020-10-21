const { Client } = require('pg');
const { DB_URI } = require('./config');

// let DB_URI;

// if (process.env.NODE_ENV === 'test') {
// 	DB_URI = 'postgresql:///usersdb_test';
// } else {
// 	DB_URI = 'postgresql:///usersdb';
// }

// let db = new Client({
// 	connectionString: DB_URI
// });

const client = new Client({
	connectionString: DB_URI
});

client.connect();

module.exports = client;
