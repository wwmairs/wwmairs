#!/usr/bin/env nodejs

const express 	 = require("express");
const sqlite3 	 = require("sqlite3").verbose();
const pug 			 = require("pug");
const hash			 = require("pbkdf2-password");
const path 			 = require("path");
const fs				 = require("fs");
const session 	 = require("express-session");
const multer     = require("multer");

const app = express();
const sequelize = require("./sequelize");
const upload = multer({ dest: "uploads/" });


const port = 8080;

// sequelize.sync({ alter: true});
// sequelize.authenticate();

app.set("view engine", "pug");

app.use("/archive", express.static("../wwmairs"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: "something better should go here"
}));

////////////
// ROUTES //
////////////

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

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/entry/:id", (req, res) => {
	sequelize.models.PortfolioEntry.findOne({ where: { id: req.params.id},
				       									  include: sequelize.models.Photo })
		.then(portfolioEntry => {
			res.render("entry", { entry: portfolioEntry });
		});
});

app.get("/entries", (req, res) => {
	sequelize.models.PortfolioEntry.findAll()
		.then((entries) => {
			res.render("entries", { entries: entries});
		});
});

app.get("/upload", (req, res) => {
	res.render("upload");
});

app.post("/upload", upload.array("photo"), (req, res, next) => {
	var photos = [];
	req.files.map(file => {
		photos.push({
			filename: file.filename,
			originalname: file.originalname,
			path: file.path
		});
	});

	sequelize.models.PortfolioEntry.create({
		name: req.body.name,
		date: req.body.date,
		description: req.body.description,
		Photos: photos
	}, { 
		include: [sequelize.models.Photo]
	});
	res.redirect("/entries");
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
	authenticate(req.body.proof, (err, user) => {
		if (err) return next(err)
		if (user) {
			req.session.regenerate(function() {
				req.session.isWill = true;
				req.session.user = "will";
				req.session.success = "You're Will!";
				res.redirect("/upload");
			});
		}
	});
});

////////////////
// MIDDLEWARE //
////////////////

function authenticate(proof, fn) {
	// check if it's me!
	fs.readFile("passwords.json", "utf8", (err, data) => {

		if (err) {
			console.error(err);
			return;
		}

		var password = JSON.parse(data).will
	
		if (proof == password) {
			fn(false, true);
		} else {
			fn(null, null);
		}
	
	});
}

function redirectIfNotWill(req, res, next) {
	if (req.session.isWill) {
		next();
	} else {
		req.session.error = "You're not will!";
		res.redirect("/");
	}
}

////////////
// LISTEN //
////////////

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
