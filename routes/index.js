
import portfolioEntries from "./portfolioentries.js";
import login from "./login.js";
import tag from "./tag.js";

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
