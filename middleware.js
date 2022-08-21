function redirectIfNotWill(req, res, next) {
	if (req.session.isWill) {
		next();
	} else {
		req.session.error = "You're not will!";
		res.redirect("/");
	}
}

module.exports = {
	onlyWill: redirectIfNotWill
};
