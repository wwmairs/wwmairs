const routeLoaders = [
	require("./portfolioentries.js"),
	require("./login.js")
];

module.exports = (app) => {
	for (loadRoutes of routeLoaders) {
		loadRoutes(app);
	}

}
