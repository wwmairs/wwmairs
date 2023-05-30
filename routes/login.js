import * as dotenv from "dotenv";
dotenv.config();

import onlyWill from "../middleware.js";

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
			if (err) {
				return next(err);
			}
			if (user) {
				req.session.regenerate(function() {
					req.session.isWill = true;
					req.session.user = "will";
					req.session.success = "You're Will!";
					res.redirect("/");
				});
			}
		});
	});
}

function authenticate(proof, fn) {
	// check if it's me!
    if (proof == process.env.WILLS_PW) {
    	fn(false, true);
    } else {
    	fn(null, null);
    }
	
}


export default defineRoutes;
