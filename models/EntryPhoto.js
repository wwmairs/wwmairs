const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	const EntryPhoto = sequelize.define("EntryPhoto", {
		entryuuid: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		photouuid: {
			type: DataTypes.UUID,
			allowNull: false,
		}
	});

	return EntryPhoto;
};
