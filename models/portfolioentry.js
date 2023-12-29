'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortfolioEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PortfolioEntry.hasMany(models.Photo, { 
          foreignKey: "portfolioEntryId",
      });
      PortfolioEntry.belongsToMany(models.Tag, {
          through: "PortfolioEntry_Tags",
      })
    }
  }
  PortfolioEntry.init({
    id: { type: DataTypes.UUIDV4, primaryKey: true },
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    description: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PortfolioEntry',
  });
  return PortfolioEntry;
};
