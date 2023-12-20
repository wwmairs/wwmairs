import * as dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import db from "../models/index.js";

import onlyWill from "../middleware.js";

const Tag = db.sequelize.models.Tag;


function getTags(req, res) {
    Tag.findAll().then((tags) => {
        res.render("tag/edit", {tags: tags});
    });
}

function saveTag(req, res) {
	var tag = {
        id: uuidv4(),
		name: req.body.name,
	};
    console.log(req.body);


	if (!req.body.id) {
		Tag.create(tag);
	} else {
		var filter = {
			where: {
				id: req.body.id
			}, 
		};

		Tag.findOne(filter).then((oldEntry) => {
			if (oldEntry) {
				oldEntry.update(tag);
			} else {
				throw new Error("no entry with that id to update");
			}
		});
	}
	res.redirect("/tags");
}

function defineRoutes(app) {

	app.get("/tags", onlyWill, getTags);
	
	app.post("/tags/save", onlyWill, saveTag);
}


export default defineRoutes;
