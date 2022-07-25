#!/usr/bin/env nodejs

const express 	 = require("express");
const sqlite3 	 = require("sqlite3").verbose();
const pug 			 = require("pug");
const hash			 = require("pbkdf2-password");
const path 			 = require("path");
const fs				 = require("fs");
const session 	 = require("express-session");
const multer     = require("multer");
const { Sequelize, DataTypes, Model } = require("sequelize");

const app = express();
const sequelize = new Sequelize({ dialect: "sqlite", storage: "test.db"});
const upload = multer({ dest: "uploads/" });

const port = 8080;

const PortfolioEntry = sequelize.define("PortfolioEntry", {
	uuid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4
	},
	name: {
		type: DataTypes.STRING,
	},
	date: {
		type: DataTypes.DATE,
	},
	description: {
		type: DataTypes.STRING,
	}
});

const EntryPhoto = sequelize.define("EntryPhoto", {
	entryuuid: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	photouuid: {
		type: DataTypes.UUID,
		allowNull: false,
	}
});

const Photo = sequelize.define("Photo", {
	uuid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4
	},
	filename: {
		type: DataTypes.STRING,
		allowNull: false
	},
	originalname: {
		type: DataTypes.STRING,
		allowNull: false
	},
	path: {
		type: DataTypes.STRING,
		allowNull: false
	}
});

app.set("view engine", "pug");

app.use("/archive", express.static("../wwmairs"));
app.use("/uploads", express.static("uploads"));
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

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/entries", (req, res) => {
	//var entries = PortfolioEntry.findAll()
	//res.json(entries);
});

app.get("/upload", (req, res) => {
	res.render("upload");
});

app.post("/upload", upload.array("photo"), (req, res, next) => {
	var portfolioEntry = PortfolioEntry.create({
		name: req.body.name,
		date: req.body.date,
		description: req.body.description
	}).then(entry => {
		req.files.map((file) => {
			console.log(file.filename);
			var photo = Photo.create({
				filename: file.filename,
				originalname: file.originalname,
			});
		});
	});
		// save photo
		// var entryPhoto = EntryPhoto.create({
		// 	entryuuid: portfolioEntry.uuid,
		// 	photouuid: photo.uuid
		// });
		// save entryphoto
	//PortfolioEntry.findAll().then(entries => res.json(entries));
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

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
