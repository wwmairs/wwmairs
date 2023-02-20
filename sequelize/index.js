import Sequelize from "sequelize";
import associateModels from "./associations.js";

import Photo from "./models/Photo.js";
import PortfolioEntry from "./models/PortfolioEntry.js";


const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "../prod.db"
});

const modelDefiners = [ Photo, PortfolioEntry];

for (const definer of modelDefiners) {
	definer(sequelize);
}

associateModels(sequelize);

export default sequelize;
