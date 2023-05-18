import Sequelize from "sequelize";
import associateModels from "./associations.js";

import Photo from "./models/Photo.js";
import PortfolioEntry from "./models/PortfolioEntry.js";
import getJSON from "../helpers.js"

const sqlitePath = getJSON("secrets.json").sqlite_path;


const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: sqlitePath
});

const modelDefiners = [ Photo, PortfolioEntry];

for (const definer of modelDefiners) {
    console.log(sqlitePath);
	definer(sequelize);
}

associateModels(sequelize);

// sequelize.sync({ alter: true });

export default sequelize;
