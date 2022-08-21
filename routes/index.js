const routeLoaders = [
	require("./portfolioentries.js")
];

module.exports = (app) => {
	for (loadRoutes of routeLoaders) {
		loadRoutes(app);
	}

}
