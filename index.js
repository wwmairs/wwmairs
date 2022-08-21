#!/usr/bin/env nodejs

const express 	 = require("express");
const sqlite3 	 = require("sqlite3").verbose();
const pug 			 = require("pug");
const path 			 = require("path");
const fs				 = require("fs");
const session 	 = require("express-session");

const app = express();
const sequelize = require("./sequelize");
const loadRoutes = require("./routes");

const port = 8080;

// sequelize.sync({ alter: true});
// sequelize.authenticate();

app.set("view engine", "pug");

app.use("/archive", express.static("../wwmairs"));
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));

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
	if (err) res.locals.message = "<p class='msg error'>" + err + "</p>";
	if (msg) res.locals.message = "<p class='msg success'>" + msg + "</p>";
	next();
});

////////////
// ROUTES //
////////////

app.get("/", (req, res) => {
	res.render("index");
});

loadRoutes(app);

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
