const { onlyWill } = require("../middleware.js");

function defineRoutes(app) {

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
					res.redirect("/entries");
				});
			}
		});
	});
}

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

module.exports = defineRoutes;
