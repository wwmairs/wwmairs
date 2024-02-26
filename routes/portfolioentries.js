import * as dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import db from "../models/index.js";

import onlyWill from "../middleware.js";

const upload = multer({ dest: "uploads/", preservePath: true });

const Photo = db.sequelize.models.Photo;
const PortfolioEntry = db.sequelize.models.PortfolioEntry;
const Tag = db.sequelize.models.Tag;


function view(req, res) {
	fetchWithPhotosByID(req.params.id)
		.then(portfolioEntry => {
            Tag.findAll().then((tags) => {
                /* this silly logic is just for dev*/
			    res.render(req.session.isWill ? "entry/view" : "entry/view", 
                           { tags: tags, entry: portfolioEntry });
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
                                          entries: entries});
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
        selling: req.body.selling == "on",
        price: req.body.price,
        edition: req.body.edition,
        available: req.body.available,
		Photos: extractPhotosIfAny(req),
	};

	if (!req.body.id) {
		PortfolioEntry.create(portfolioEntry, {include: Photo})
		    .then((entryInstance) => {
                updateAnyTagsOnEntry(req, entryInstance);
		    });
	} else {
		PortfolioEntry.findOne({where: {id: req.body.id}})
		.then((oldEntry) => {
			if (oldEntry) {
				oldEntry.update(portfolioEntry)
				.then((entryInstance) => {
					portfolioEntry.Photos.map((photo) => {
                        if (!photo.id) {
						    photo.portfolioEntryId = entryInstance.id;
						    Photo.create(photo)
                        }
					});
					updateAnyTagsOnEntry(req, entryInstance);
				});
			} else {
				throw new Error("no entry with that id to update");
			}
		});
	}
    res.sendStatus(200);
}

function updateAnyTagsOnEntry(req, entry) {
	if (req.body.tags) {
        var tagIds = req.body.tags.split(',');
        entry.getTags().then((tags) => {
            console.log(tags);
            var entryTagIds = tags.map((tag) => tag.id);
            var idsToAdd = tagIds.filter(id => !entryTagIds.includes(id));
            var idsToDelete = entryTagIds.filter(id => !tagIds.includes(id));
            entry.addTags(idsToAdd);
            entry.removeTags(idsToDelete);
        });
	}
}

function extractPhotosIfAny(req) {
	var photos = [];
	
	if (req.files) {
		req.files.map(file => {
			photos.push({
                id: uuidv4(),
				name: file.originalname,
				originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path
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
