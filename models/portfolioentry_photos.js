'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortfolioEntry_Photos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PortfolioEntry_Photos.init({
    PortfolioEntryId: DataTypes.UUIDV4,
    PhotoID: DataTypes.UUIDV4,
    Order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PortfolioEntry_Photos',
  });
  return PortfolioEntry_Photos;
};
