var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 30,
	connectionTimeout: 30000,
	host: "localhost",
	user: "nodejs",
	password: "5857",
	database: "image_board",
	multipleStatements: true
});

module.exports.pool = pool;
