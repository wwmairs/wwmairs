
import portfolioEntries from "./portfolioentries.js";
import login from "./login.js";

const routeLoaders = [
	portfolioEntries,
	login
];

const exports = (app) => {
	for (var loadRoutes of routeLoaders) {
		loadRoutes(app);
	}

}

export default exports;
