import * as dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import db from "../models/index.js";

import onlyWill from "../middleware.js";

const upload = multer();

const Photo = db.sequelize.models.Photo;
const PortfolioEntry = db.sequelize.models.PortfolioEntry;
const Tag = db.sequelize.models.Tag;


function view(req, res) {
	fetchWithPhotosByID(req.params.id)
		.then(portfolioEntry => {
            Tag.findAll().then((tags) => {
			    res.render(req.session.isWill ? "entry/edit" : "entry/view", { tags: tags, entry: portfolioEntry });
            });
		});
}

function edit(req, res) {
	fetchWithPhotosByID(req.params.id)
		.then(portfolioEntry => {
            Tag.findAll().then((tags) => {
			    res.render("entry/edit", { tags: tags, entry: portfolioEntry });
            });
		});
}

function fetchWithPhotosByID(id) {
	return PortfolioEntry.findOne({ where: { id: id},
						       	    include: [Photo, Tag] });
}

function getEntries(req, res) {
	PortfolioEntry.findAll({ 
		include: [Photo, Tag],
		order: [["date", "DESC"]] })
		.then((entries) => {
            Tag.findAll().then((tags) => {
			    res.render("entry/all", { tags: tags, 
                                          entries: entries, 
			    						  upload: req.session.isWill,
			    						  noMenu: true });
            });
		});
}

function saveEntry(req, res) {
	var portfolioEntry = {
        id: uuidv4(),
		name: req.body.name,
		date: req.body.date,
		description: req.body.description,
		link: req.body.link,
		Photos: extractPhotosIfAny(req),
	};

	if (!req.body.id) {
		PortfolioEntry.create(portfolioEntry, {include: Photo});
			// .then((entryInstance) => {
			// 	entryInstance.setTags(req.body.tags);
			// });
	} else {
		var filter = {
			where: {
				id: req.body.id
			}, 
			include: Photo
		};

		PortfolioEntry.findOne(filter).then((oldEntry) => {
			if (oldEntry) {
				oldEntry.update(portfolioEntry, {include: Photo})
					.then((entryInstance) => {
						Tag.findAll({where: {id: req.body.tags}})
							.then((tags) => { 
								entryInstance.setTags(tags)
							});
					});
			} else {
				throw new Error("no entry with that id to update");
			}
		});
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
                bytes: Buffer.from(file.buffer).toString("base64", file.encoding),
                encoding: file.encoding,
                mimetype: file.mimetype,
                size: file.size
			});
		});
	}

	return photos;
}

function defineRoutes(app) {

	app.get("/entry/:id", view);
	
	app.get("/", getEntries);
	
	app.post("/entry/save", onlyWill, upload.array("photo"), saveEntry);
	
	app.get("/entry/create", onlyWill, (req, res) => {
		res.render("entry/create");
	});

	app.get("/entry/edit/:id", onlyWill, edit);

}


export default defineRoutes;
