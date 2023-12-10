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
      Photo.belongsTo(models.PortfolioEntry, { 
          foreignKey: "portfolioEntryId",
          onDelete: "CASCADE",
      });
    }
  }
  Photo.init({
    id: { type: DataTypes.UUIDV4, primaryKey: true },
    name: DataTypes.STRING,
    originalname: DataTypes.STRING,
    bytes: DataTypes.BLOB,
    encoding: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};