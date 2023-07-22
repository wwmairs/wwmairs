import * as dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import db from "../models/index.js";

import onlyWill from "../middleware.js";

const upload = multer();

const Photo = db.sequelize.models.Photo;
const PortfolioEntry = db.sequelize.models.PortfolioEntry;


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
	return PortfolioEntry.findOne({ where: { id: id},
						       	    include: Photo });
}

function getEntries(req, res) {
	PortfolioEntry.findAll({ 
		include: Photo,
		order: [["date", "DESC"]] })
		.then((entries) => {
            if (entries.Photos && entries.Photos.length) {
            }
			res.render("entry/all", { entries: entries, 
									  upload: req.session.isWill,
									  noMenu: true });
		});
}

function saveEntry(req, res) {
	var portfolioEntry = {
        id: uuidv4(),
		name: req.body.name,
		date: req.body.date,
		description: req.body.description,
		link: req.body.link,
		Photos: extractPhotosIfAny(req)
	};

	var includePhotos = {
		include: Photo
	}

	if (!req.body.id) {
		PortfolioEntry.create(portfolioEntry, includePhotos);
	} else {
		var filter = {
			where: {
				id: req.body.id
			}, 
			include: [Photo]
		};

		PortfolioEntry.findOne(filter).then((oldEntry) => {
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
                id: uuidv4(),
				name: file.originalname,
				originalname: file.originalname,
                bytes: Buffer.from(file.buffer).toString("base64"),
                encoding: file.encoding,
                mimetype: file.mimetype,
                size: file.size
			});
		});
	}
    console.log(photos);

	return photos;
}

function defineRoutes(app) {

	app.get("/entry/:id", getEntryByID);
	
	app.get("/", getEntries);
	
	app.post("/entry/save", onlyWill, upload.array("photo"), saveEntry);
	
	app.get("/entry/create", onlyWill, (req, res) => {
		res.render("entry/create");
	});

	app.get("/entry/edit/:id", edit);

}


export default defineRoutes;
