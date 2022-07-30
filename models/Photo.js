module.exports = (sequelize) => {
	const Photo = sequelize.define("Photo", {
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
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
