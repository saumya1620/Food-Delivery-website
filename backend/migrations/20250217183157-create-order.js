"use strict";

const { ORDER_STATUSES } = require("../constants/user.messages");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      address: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: ORDER_STATUSES.Pending,
      },
      deliveryFee: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      discount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      payment: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
