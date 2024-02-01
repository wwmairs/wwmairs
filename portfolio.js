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

app.use("/robots.txt", (req, res, next) => {
    res.type("text/plain");
    res.send("user-agent: *\nDisallow: /");
});

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
	if (err) res.locals.message = "<p class='msg error'>" + err + "</p>";
	if (msg) res.locals.message = "<p class='msg success'>" + msg + "</p>";
	next();
});

app.use((req, res, next) => {
    if (!req.session.isWill) {
        req.session.regenerate(function() {
            req.session.isWill = true;
            req.session.user = "will";
        });
    }
    next();
});

loadRoutes(app);


app.get("/about", (req, res) => {
    res.render("about");
});


app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
