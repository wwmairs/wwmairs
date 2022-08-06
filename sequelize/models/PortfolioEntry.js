const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	const PortfolioEntry = sequelize.define("PortfolioEntry", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
		},
		date: {
			type: DataTypes.DATE,
		},
		description: {
			type: DataTypes.STRING,
		},
		link: {
			type: DataTypes.STRING,
		}
	});

	return PortfolioEntry;
};
