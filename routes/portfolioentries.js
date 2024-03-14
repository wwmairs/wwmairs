import * as dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";
import multer from "multer";
import fs from "fs";
import convert from "heic-convert";
import db from "../models/index.js";
import conf from "../config/config.js";
import stripeInit from "stripe"

import onlyWill from "../middleware.js";

const upload = multer({ dest: "uploads/", preservePath: true });

const Photo = db.sequelize.models.Photo;
const PortfolioEntry = db.sequelize.models.PortfolioEntry;
const Tag = db.sequelize.models.Tag;

const config = conf[process.env.NODE_ENV]
const stripe = stripeInit(config.stripe_secret);


function view(req, res) {
	fetchWithPhotosByID(req.params.id)
		.then(portfolioEntry => {
            Tag.findAll().then((tags) => {
                /* this silly logic is just for dev*/
			    res.render(req.session.isWill ? "entry/edit" : "entry/view", 
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

function showByTag(req, res) {
    PortfolioEntry.findAll({
        include: [ Photo, Tag],
        order: [["date", "DESC"]] })
        .then(entries => {
            var filtered = entries.filter(e => e.Tags.some(t => t.name == req.params.tagname));
            res.render("things", {entries: filtered})
        });
}

function getEntriesByTag(req, res) {
    PortfolioEntry.findAll({
        include: [{
            model: Photo,
            required: false,
        }, {
            model: Tag,
            required: true,
            where: {
                name: req.params.tagname
            }
        }],
        order: [["date", "DESC"]] })
        .then(entries => res.json(entries));
}

function saveEntry(req, res) {
	var portfolioEntry = {
        id: uuidv4(),
		name: req.body.name,
		date: req.body.date,
		description: req.body.description,
		link: req.body.link,
        selling: req.body.selling,
        price: req.body.price,
        edition: req.body.edition,
        available: req.body.available,
		Photos: extractPhotosIfAny(req),
	};

	if (!req.body.id) {
		PortfolioEntry.create(portfolioEntry, {include: Photo})
		    .then((entryInstance) => {
                updateAnyTagsOnEntry(req, entryInstance);
                createStripeProduct(entryInstance);
		    });
	} else {
		PortfolioEntry.findOne({where: {id: req.body.id}})
		.then((oldEntry) => {
			if (oldEntry) {
				oldEntry.update(portfolioEntry)
				.then((entryInstance) => {
                    // update stripe product
                    // should check whether exists already ?
                    updateStripeProduct(entryInstance);
					portfolioEntry.Photos.map((photo) => {
					    photo.portfolioEntryId = entryInstance.id;
					    Photo.create(photo)
					});
					updateAnyTagsOnEntry(req, entryInstance);
                    res.json(portfolioEntry);
				});
			} else {
				throw new Error("no entry with that id to update");
			}
		});
	}
}

function createOrUpdateProduct(entry) {
}

function createStripeProduct(entry) {
    var stripeProduct = stripe.products.create({
        id: entry.id,
        name: entry.name,
        active: entry.selling,
        description: entry.description,
        default_price_data: {
            currency: "usd",
            unit_amount: (entry.price ?? 0) * 100,
        }
    });
}

function updateStripeProduct(entry) {
    var stripeProduct = stripe.products.update(
        entry.id,
        {
        name: entry.name,
        active: entry.selling,
        description: entry.description,

        // replace this with some logic ! 
        // update doesn't allow default_price_data
        // only default_price which expects an price id

        default_price_data: {
            currency: "usd",
            unit_amount: (entry.price ?? 0) * 100,
        }
    });
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
            if (file.mimetype == "image/heic") {
                convertHEIC(file);
                file.mimetype = "image/jpeg";
            }
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

async function convertHEIC(file) {
    const inputBuffer = await promisify(fs.readFile)(file.path);
    const outputBuffer = await convert({
        buffer: inputBuffer,
        format: "JPEG",
        quality: 1
    });

    await promisify(fs.writeFile)(file.path, outputBuffer);
}


function defineRoutes(app) {
	
    app.get("/entry/all/", getEntries);

    app.get("/entry/tag/:tagname", getEntriesByTag);

    app.get("/things/:tagname", showByTag);
	
	app.post("/entry/save", onlyWill, upload.array("imageUpload"), saveEntry);
	
	app.get("/entry/create", onlyWill, (req, res) => {
		res.render("entry/edit");
	});

	app.get("/entry/edit/:id", onlyWill, edit);
	
    app.get("/entry/:id", view);

}


export default defineRoutes;
