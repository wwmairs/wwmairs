const { Sequelize } = require("sequelize");
const { associateModels } = require("./associations.js");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "../test.db"
});

const modelDefiners = [
	require("./models/Photo.js"),
	require("./models/PortfolioEntry.js")
];

for (const definer of modelDefiners) {
	definer(sequelize);
}

associateModels(sequelize);

module.exports = sequelize;
