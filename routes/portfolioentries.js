const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const sequelize = require("../sequelize");

const { onlyWill } = require("../middleware.js");

function getEntryByID(req, res) {
	sequelize.models.PortfolioEntry.findOne({ where: { id: req.params.id},
				       									  					include: sequelize.models.Photo })
		.then(portfolioEntry => {
			res.render("entry", { entry: portfolioEntry });
		});
}

function getEntries(req, res) {
	sequelize.models.PortfolioEntry.findAll({ include: sequelize.models.Photo,
																						order: [["date", "DESC"]] })
		.then((entries) => {
			res.render("entries", { entries: entries, upload: req.session.isWill });
		});
}

function saveEntry(req, res) {
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
		link: req.body.link,
		Photos: photos
	}, { 
		include: [sequelize.models.Photo]
	});
	res.redirect("/entries");
}

function defineRoutes(app) {

	app.get("/entry/:id", getEntryByID);
	
	app.get("/entries", getEntries);
	
	app.get("/upload", onlyWill, (req, res) => {
		res.render("upload");
	});
	
	app.post("/upload", onlyWill, upload.array("photo"), saveEntry);
	

}

module.exports = defineRoutes;
