/*
 * © Gabriel Kulp 2018
 * Email: kulpga@oregonstate.edu
 */

// pull in modules
var fs = require('fs'); // file operations
var path = require('path'); // filepath manipulations
var db = require('./dbcon.js'); // MariaDB connection
var express = require('express'); // handy HTTP server stuff
var hbs  = require('express-handlebars'); // templating middleware
var bodyParser = require('body-parser'); // extract JSON from POST requests
var multer = require('multer'); // extract uploaded files from POST requests

// read external config
var port = process.env.PORT || 3000;
var posts;
db.pool.query("SELECT * FROM posts", [], function (error, results, fields) {
	if (error || !results) {
		console.error("!! Database is either not running or setup improperly!");
		console.log("== Exiting");
		process.exit(0);
	}
	posts = results.map(x => {return {"id": x.id, "data": JSON.parse(x.data)};}).reverse();
});

// set up express, handlebars, multer
var upload = multer({dest: path.join(__dirname, "./temp")}); // temp path for newly-uploaded files
var app = express();
app.set('view engine', 'handlebars');
app.set('mysql', db);
app.use(express.static('public')); // serve contents of public folder
app.use(bodyParser.urlencoded({ extended: true })); // read form data as JSON
app.use(bodyParser.json()); // read form data as JSON
app.engine('handlebars', hbs({ // enable templating
	defaultLayout: 'skeleton', // use views/layouts/skeleton.handlebars as base layout for everything
	partialsDir: ['views/partials/'] // grab partial templates from views/partials/
}));

// Main page with posts
app.get('/', function (req, res) {
	res.render("home", {"posts": posts});
});

// admin control page (to delete posts)
app.get('/admin', function (req, res) {
	res.render("admin", {"posts": posts});
});

// post submission page
app.get('/submit', function (req, res) {
	res.render("submit");
});

// add posts and upload images to public/images/
app.post('/post/add', upload.single("image"), function (req, res) {
	if (req.body && req.body.title) {
		// uploaded file is in req.file.path. We need to move it to public/images/
		var targetPath = path.join(__dirname, "./public/images/", req.file.originalname);
		fs.rename(req.file.path, targetPath, error => {
        	if (error) res.status(400).send("Filesystem error: " + error);
        	// construct new post from form data and local stuff
			var newPost = {
				data: {
					photo: path.join("/images/", req.file.originalname),
					alt: req.body.title,
					title: req.body.title,
					author: req.body.author,
					date: (new Date()).toString().split(' ').splice(1,4).join(' ')
				}
			};
			newPost.data.content = req.body.content.split("\n").filter(Boolean); // remove empty lines from content
			db.pool.query("INSERT INTO posts (data) values (?); SELECT LAST_INSERT_ID()", [JSON.stringify(newPost.data)], function (error, results, fields) {
				if (error) {
					console.error("!! Database error: " + error);
					res.status(400).send("Database error: " + error);
				}
				// add new post to server RAM after it's in the database
				newPost.id = results[0].insertId;
				posts.unshift(newPost);
				res.redirect("/"); // bring user back to main page
			});
		});
	} else {
		console.error("!! Malformed request to /post/add: " + req);
		res.status(400).send("Malformed request");
	}
});

// delete posts from database, delete images from public/images/
app.post('/post/delete', function (req, res) {
	if (req.body && req.body.postID) {
		db.pool.query("DELETE FROM posts WHERE id=?", [req.body.postID], function (error, results, fields) {
			if (error) {
				console.error("!! Database error: " + error);
				res.status(400).send("Database error: " + error);
			}
			var toDelete = posts.filter(x => (x.id == req.body.postID))[0];

			fs.unlink(path.join(__dirname, "./public/", toDelete.data.photo), error => {
				if (error) console.error("!! Filesystem error: " + error);
				// don't bother telling client, since they won't care about server-side file management
			});

			posts = posts.filter(x => (x.id != req.body.postID));
			res.redirect("/admin");
		});
	} else {
		console.error("!! Malformed request to /post/delete: " + req);
		res.status(400).send("Malformed request");
	}
});

// catch-all for invalid POST requests
app.post('*', function (req, res) {
	res.status(400).send("Invalid POST address");
});

// catch-all for invalid GET requests
app.get('*', function (req, res) {
	res.render("404");
});

// start server
app.listen(port, function () {
	console.log("== Server is listening on port", port);
});
