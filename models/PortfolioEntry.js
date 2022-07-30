module.exports = (sequelize) => {
	const PortfolioEntry = sequelize.define("PortfolioEntry", {
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		name: {
			type: DataTypes.STRING,
		},
		date: {
			type: DataTypes.DATE,
		},
		description: {
			type: DataTypes.STRING,
		}
	});
	return PortfolioEntry;
};
