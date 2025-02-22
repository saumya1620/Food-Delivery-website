'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FoodCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FoodCategory.init({
    name: DataTypes.STRING,
    imagePath: DataTypes.STRING,
    status: DataTypes.ENUM('Active', 'Inactive', 'Deleted')
  }, {
    sequelize,
    modelName: 'FoodCategory',
  });
  return FoodCategory;
};