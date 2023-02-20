import { Sequelize, DataTypes, Model } from "sequelize";

const exports = (sequelize) => {
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

export default exports;
