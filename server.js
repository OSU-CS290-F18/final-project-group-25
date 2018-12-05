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
	posts = results.map(x => {return {"id": x.id, "data": JSON.parse(x.data)};}).reverse();
});
//var posts = require('./postData.json');

// set up express and handlebars
var app = express();
app.set('view engine', 'handlebars');
app.set('mysql', db);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('handlebars', hbs({
	defaultLayout: 'skeleton',
	partialsDir: ['views/partials/']
}));

// Main page with posts
app.get('/', function (req, res) {
	res.render("home", {"posts": posts});
});

app.get('/admin', function (req, res) {
	res.render("admin", {"posts": posts});
});

app.get('/submit', function (req, res) {
	res.render("submit");
});

app.post('/post/add', function (req, res) {
	if (req.body && req.body.title) {
		var newPost = {
			data: {
				photo: req.body.photo,
				alt: req.body.title,
				title: req.body.title,
				author: req.body.author,
				date: (new Date()).toString().split(' ').splice(1,4).join(' ')
			}
		};
		// split post into paragraphs. ignore empty lines.
		newPost.data.content = req.body.content.split("\n").filter(Boolean);
		db.pool.query("INSERT INTO posts (data) values (?); SELECT LAST_INSERT_ID()", [JSON.stringify(newPost.data)], function (error, results, fields) {
			if (error)
				res.status(400).send("Database error: " + error);
			newPost.id = results[0].insertId;
			posts.unshift(newPost);
			res.status(200).send("Success");
		});
	} else {
		res.status(400).send("Malformed request");
	}
});

app.post('/post/delete', function (req, res) {
	if (req.body && req.body.postID) {
		db.pool.query("DELETE FROM posts WHERE id=?", [req.body.postID], function (error, results, fields) {
			if (error)
				res.status(400).send("Database error: " + error);
			posts = posts.filter(x => (x.id != req.body.postID));
			res.redirect("/");
		});
	} else {
		res.status(400).send("Malformed request");
	}
});

// catch-all for invalid post requests
app.post('*', function (req, res) {
	res.status(400).send("Invalid POST address");
});

// catch-all if requesting something else
app.get('*', function (req, res) {
	res.render("404");
});

// start server
app.listen(port, function () {
	console.log("== Server is listening on port", port);
});
