function associateModels(sequelize) {
	const { Photo, PortfolioEntry } = sequelize.models;
	
	PortfolioEntry.hasMany(Photo);
}

module.exports = { associateModels };
