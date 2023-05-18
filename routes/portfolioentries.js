import * as dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import sequelize from "../sequelize/index.js";

import onlyWill from "../middleware.js";

const upload = multer({ dest: process.env.PHOTO_PATH });


function getEntryByID(req, res) {
	fetchWithPhotosByID(req.params.id)
		.then(portfolioEntry => {
			res.render("entry/view", { entry: portfolioEntry });
		});
}

function edit(req, res) {
	fetchWithPhotosByID(req.params.id)
		.then(portfolioEntry => {
			res.render("entry/edit", { entry: portfolioEntry });
		});
}

function fetchWithPhotosByID(id) {
	return sequelize.models.PortfolioEntry.findOne({ where: { id: id},
						          									  				 include: sequelize.models.Photo });
}

function getEntries(req, res) {
	sequelize.models.PortfolioEntry.findAll({ 
		include: sequelize.models.Photo,
		order: [["date", "DESC"]] })
		.then((entries) => {
			res.render("entry/all", { entries: entries, 
																upload: req.session.isWill,
																noMenu: true });
		});
}

function saveEntry(req, res) {
	var portfolioEntry = {
		name: req.body.name,
		date: req.body.date,
		description: req.body.description,
		link: req.body.link,
		Photos: extractPhotosIfAny(req)
	};

	var includePhotos = {
		include: [sequelize.models.Photo]
	}

	if (!req.body.id) {
		sequelize.models.PortfolioEntry.create(portfolioEntry, includePhotos);
	} else {
		var filter = {
			where: {
				id: req.body.id
			}, 
			include: [sequelize.models.Photo]
		};

		sequelize.models.PortfolioEntry.findOne(filter).then((oldEntry) => {
			if (oldEntry) {
				oldEntry.update(portfolioEntry, includePhotos);
			} else {
				throw new Error("no entry with that id to update");
			}
		});
		// look for the id
		// if match, update
		// else just create
	}
	res.redirect("/");
}

function extractPhotosIfAny(req) {
	var photos = [];
	
	if (req.files) {
		req.files.map(file => {
			photos.push({
				filename: file.filename,
				originalname: file.originalname,
				path: file.path
			});
		});
	}

	return photos;
}

function defineRoutes(app) {

	app.get("/entry/:id", getEntryByID);
	
	app.get("/", getEntries);
	// app.get("/entries", getEntries);
	
	app.post("/entry/save", onlyWill, upload.array("photo"), saveEntry);
	
	app.get("/entry/create", onlyWill, (req, res) => {
		res.render("entry/create");
	});

	app.get("/entry/edit/:id", edit);

}


export default defineRoutes;
