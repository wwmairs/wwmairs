import * as dotenv from "dotenv";

dotenv.config();

import Sequelize from "sequelize";
import associateModels from "./associations.js";

import Photo from "./models/Photo.js";
import PortfolioEntry from "./models/PortfolioEntry.js";

console.log(process.env)

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: process.env.SQLITE_PATH 
});

const modelDefiners = [ Photo, PortfolioEntry];

for (const definer of modelDefiners) {
	definer(sequelize);
}

associateModels(sequelize);

// sequelize.sync({ alter: true });

export default sequelize;
