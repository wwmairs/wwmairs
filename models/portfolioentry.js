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
          forgeignKey: "id",
      })
    }
  }
  PortfolioEntry.init({
    id: DataTypes.UUIDV4,
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
