"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: "userId" });
      //Order.belongsToMany(models.Dish, { through: models.OrderDish });
      Order.belongsToMany(models.Dish, {
        through: models.OrderDish,
        foreignKey: "orderId",
        otherKey: "dishId",
      });
    }
  }
  Order.init(
    {
      userId: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      address: DataTypes.JSON,
      status: DataTypes.STRING,
      deliveryFee: DataTypes.FLOAT,
      discount: DataTypes.FLOAT,
      payment: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
