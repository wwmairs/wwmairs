function associateModels(sequelize) {
	const { Photo, PortfolioEntry } = sequelize.models;
	
	PortfolioEntry.hasMany(Photo);
}

export default associateModels;
