'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortfolioEntry_Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PortfolioEntry_Tags.init({
    PortfolioEntryId: { type: DataTypes.UUIDV4, primaryKey: true },
    TagId: { type: DataTypes.UUIDV4, primaryKey: true }
  }, {
    sequelize,
    modelName: 'PortfolioEntry_Tags',
  });
  return PortfolioEntry_Tags;
};
