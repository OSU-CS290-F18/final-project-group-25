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

// read external config
var port = process.env.PORT || 3000;
var posts = JSON.parse(fs.readFileSync('postData.json', 'utf8'));

// set up express to use handlebars
var app = express();
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.engine('handlebars', hbs({
	defaultLayout: 'skeleton',
	partialsDir: [
		'views/partials/'
	]
}));

// home page with multiple posts
app.get('/', function (req, res) {
	res.render("home", {
		posts: posts
	});
});

// home page with multiple posts
app.get('/home', function (req, res) {
	res.render("home", {
		posts: posts
	});
});

app.get('/submit', function (req, res) {
	res.render("submit");
});

/* page with single post (or 404 if invalid)
app.get('/posts/:postID', function (req, res) {
	if (posts[req.params.postID])
		res.render("single", posts[req.params.postID]);
	else
		res.render("404");
});
*/

// catch-all if requesting something else
app.get('*', function (req, res) {
	res.render("404");
});

// start server
app.listen(port, function () {
	console.log("== Server is listening on port", port);
});
