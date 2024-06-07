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

function getPhotos(req, res) {
    Photo.findAll({
        order: [["updatedAt", "DESC"]]
    }).then((photos) => {
        res.json({photos: photos});
    });
 
}

function savePhotos(req, res) {
    var Photos = extractPhotosIfAny(req);
    res.json({"success": true});
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
	
	app.post("/photos/upload", onlyWill, upload.array("imageUpload"), savePhotos);

    app.get("/photos", getPhotos);

}


export default defineRoutes;
