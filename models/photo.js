'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Photo.belongsToMany(models.PortfolioEntry, { through: "PortfolioEntryPhotos"});
    }
  }
  Photo.init({
    id: { type: DataTypes.UUIDV4, primaryKey: true },
    filename: DataTypes.STRING,
    originalname: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};
