#!/usr/bin/env nodejs

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const pug 		= require("pug");
const hash		= require("pbkdf2-password");
const path 		= require("path");
const fs			= require("fs");
const session = require("express-session");

const app = express();
const db = new sqlite3.Database("test.db");

const port = 8080;

app.set("view engine", "pug");

app.use("/archive", express.static("../wwmairs"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: "something better should go here"
}));

app.use((req, res, next) => {
	var err = req.session.error;
	var msg = req.session.success;
	delete req.session.error;
	delete req.session.success;
	res.locals.message = "";
	next();
});

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/users", (req, res) => {
	db.get("SELECT * FROM  users;", (err, response) => {
		if (err) {
			console.log(err);
		}
		console.log(JSON.stringify(response));
		res.json(response);
	});
});

app.get("/upload", restrict, (req, res) => {
	res.send("this is the upload page!");
});

app.get("/logout", (req, res) => {
	req.session.destroy(() => {
		res.redirect("/");
	});
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", (req, res, next) => {
	console.log(req.body);
	authenticate(req.body.proof, (err, user) => {
		if (err) return next(err)
		if (user) {
			console.log(`authentication worked and user is {$user}`);
			req.session.regenerate(function() {
				req.session.user = "will";
				req.session.success = "You're Will!";
				res.redirect("/upload");
			});
		}
	});
});

function authenticate(proof, fn) {
	// check if it's me!
	fs.readFile("password.txt", "utf8", (err, data) => {

		if (err) {
			console.error(err);
			return;
		}

		console.log(data);
		console.log(proof);
	
		if (proof == data) {
			fn(false, true);
		} else {
			fn(null, null);
		}
	
	});
}

function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = "You're not will!";
		res.redirect("/login");
	}
}

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
