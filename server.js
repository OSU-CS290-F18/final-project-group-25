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
var express = require('express');
var hbs  = require('express-handlebars');
var bodyParser = require('body-parser');

// read external config
var port = process.env.PORT || 3000;
var posts = require('./postData.json');

// set up express to use handlebars
var app = express();
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.json());
app.engine('handlebars', hbs({
	defaultLayout: 'skeleton',
	partialsDir: [
		'views/partials/'
	]
}));

// Default page
app.get('/', function (req, res) {
/*	next();
});

// home page with multiple posts
app.get('/home', function (req, res) {
*/	res.render("home", {"posts": posts});
});

app.get('/submit', function (req, res) {
	res.render("submit");
});

app.post('/submit/data', function (req, res) {
	if (req.body && req.body.title) {
		var newPost = {
			photoURL: req.body.photoURL,
			alt: req.body.alt,
			title: req.body.title,
			author: req.body.author,
			date: req.body.date
		};
		// split post into paragraphs. ignore empty lines.
		newPost.content = req.body.content.split("\n").filter(Boolean);
		posts.unshift(newPost);
		res.status(200).send("Success");
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
