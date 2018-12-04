/*
 * Write your routing code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name: Gabriel Kulp
 * Email: kulpga@oregonstate.edu
 */

// pull in modules
var fs = require('fs');
var path = require('path');
var db = require('./dbcon.js');
var express = require('express');
var hbs  = require('express-handlebars');
var bodyParser = require('body-parser');

// read external config
var port = process.env.PORT || 3000;
var posts;
db.pool.query("SELECT * FROM posts", [], function (error, results, fields) {
	posts = results.map(x => JSON.parse(x.data));
});
//var posts = require('./postData.json');

// set up express and handlebars
var app = express();
app.set('view engine', 'handlebars');
app.set('mysql', db);
app.use(express.static('public'));
app.use(bodyParser.json());
app.engine('handlebars', hbs({
	defaultLayout: 'skeleton',
	partialsDir: ['views/partials/']
}));

// Main page with posts
app.get('/', function (req, res) {
	res.render("home", {"posts": posts.reverse()});
});

app.get('/submit', function (req, res) {
	res.render("submit");
});

app.post('/submit/data', function (req, res) {
	if (req.body && req.body.title) {
		var newPost = {
			photo: req.body.photo,
			alt: req.body.title,
			title: req.body.title,
			author: req.body.author,
			date: (new Date()).toString().split(' ').splice(1,4).join(' ')
		};
		// split post into paragraphs. ignore empty lines.
		newPost.content = req.body.content.split("\n").filter(Boolean);
		db.pool.query("INSERT INTO posts (data) values (?)", [JSON.stringify(newPost)], function (error, results, fields) {
			if (error)
				res.status(400).send("Database error: " + error);
			posts.push(newPost);
			res.status(200).send("Success");
		});
	} else {
		res.status(400).send("Malformed request");
	}
});

// catch-all if requesting something else
app.get('*', function (req, res) {
	res.render("404");
});

// start server
app.listen(port, function () {
	console.log("== Server is listening on port", port);
});
