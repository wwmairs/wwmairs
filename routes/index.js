
import portfolioEntries from "./portfolioentries.js";
import login from "./login.js";
import tag from "./tags.js";

const routeLoaders = [
	portfolioEntries,
	login,
    tag
];

const exports = (app) => {
	for (var loadRoutes of routeLoaders) {
		loadRoutes(app);
	}

}

export default exports;
