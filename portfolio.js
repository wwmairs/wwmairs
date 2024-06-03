#!/usr/bin/env nodejs

import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import loadRoutes from "./routes/index.js";

const app = express();

const port = 8080;

dotenv.config();

app.set("view engine", "pug");

app.use("/archive", express.static("../wwmairs"));
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));
app.use("/vue", express.static("vue"));

app.use("/robots.txt", (req, res, next) => {
    res.type("text/plain");
    res.send("user-agent: *\nDisallow: /");
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: "something better should go here"
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use((req, res, next) => {
	var err = req.session.error;
	var msg = req.session.success;
	delete req.session.error;
	delete req.session.success;
	res.locals.message = "";
	if (err) res.locals.message += "<Message class='error'>" + err + "</Message>";
	if (msg) res.locals.message += "<Message class='success'>" + msg + "</Message>";
	next();
});


loadRoutes(app);

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/", (req, res) => {
    res.render("index");
});


app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
