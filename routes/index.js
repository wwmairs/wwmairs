
import portfolioEntries from "./portfolioentries.js";
import login from "./login.js";
import tag from "./tags.js";
import stripe from "./stripe.js";
import photo from "./photo.js";

const routeLoaders = [
	portfolioEntries,
    photo,
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
