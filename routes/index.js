
import portfolioEntries from "./portfolioentries.js";
import login from "./login.js";
import tag from "./tags.js";
import stripe from "./stripe.js";

const routeLoaders = [
	portfolioEntries,
	login,
    tag,
    stripe,
];

const exports = (app) => {
	for (var loadRoutes of routeLoaders) {
		loadRoutes(app);
	}

}

export default exports;
