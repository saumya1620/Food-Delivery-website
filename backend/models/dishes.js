"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Dish.belongsTo(models.FoodCategory, { foreignKey: "categoryId" });
      //Dish.belongsToMany(models.Order, { through: models.OrderDish });
      Dish.belongsToMany(models.Order, {
        through: models.OrderDish,
        foreignKey: "dishId",
        otherKey: "orderId",
      });
    }
  }
  Dish.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.FLOAT,
      imageUrl: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      type: DataTypes.ENUM("Veg", "Non-Veg"),
    },
    {
      sequelize,
      modelName: "Dish",
    }
  );
  return Dish;
};
