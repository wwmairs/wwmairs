const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	const Photo = sequelize.define("Photo", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		filename: {
			type: DataTypes.STRING,
			allowNull: false
		},
		originalname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		path: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
	
	return Photo;
};
