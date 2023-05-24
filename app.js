#!/usr/bin/env nodejs

import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import loadRoutes from "./routes/index.js";

const app = express();

const port = 80;
const ip = "0.0.0.0";

dotenv.config();

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


loadRoutes(app);


// app.get("/", (req, res) => {
// 	res.render("index", {"noMenu": true});
// });

app.listen(port, ip, () => {
	console.log(`Listening on ${port}`);
});
