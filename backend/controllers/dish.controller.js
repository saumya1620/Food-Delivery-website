const { USER_MESSAGES } = require("../constants/user.messages");
const fs = require("fs");
const db = require("../models");
const { Op } = require("sequelize");

class DishController {
  static async checkIfExist(value, { req }) {
    const { id: dishId } = req.params;
    const cond = { name: value };
    if (dishId) {
      cond.id = { [Op.ne]: dishId };
    }
    const existingDish = await db.Dish.findOne({ where: cond });
    if (existingDish) {
      throw new Error(USER_MESSAGES.dishAlreadyExist);
    }
  }

  static async fetchAll(req, res) {
    const { offset, limit } = req.query;
    const dishes = await db.Dish.findAndCountAll({
      offset: offset || 0,
      limit: limit || 100,
    });
    res.status(200).json({
      success: true,
      message: USER_MESSAGES.fetchAllDishes,
      data: dishes,
    });
  }
  static async create(req, res) {
    const { name, description, categoryId, price, type } = req.body;

    const dish = await db.Dish.create({
      name: name,
      description: description,
      categoryId: categoryId,
      price: price,
      type: type,
    });

    const newFilepath =
      "public/dishes/" + dish.id + "." + req.file.originalname.split(".").pop();
    fs.rename(req.file.path, newFilepath, async (err) => {
      if (err) {
        throw err;
      }
      dish.imageUrl = newFilepath;
      await dish.save();

      console.log("Rename successful");
    });

    res
      .status(200)
      .json({ success: true, message: USER_MESSAGES.dishCreated, data: dish });
  }

  static async update(req, res) {
    const { id } = req.params;
    const { name, description, categoryId, price, type } = req.body;
    const dish = await db.Dish.findByPk(id);
    if (!dish) {
      return res.status(500).json({
        success: false,
        message: USER_MESSAGES.dishDoesntExist,
        errors: null,
      });
    }

    dish.name = name;
    dish.description = description;
    dish.categoryId = categoryId;
    dish.price = price;
    dish.type = type;
    await dish.save();

    const newFilepath =
      "public/dishes/" + dish.id + "." + req.file.originalname.split(".").pop();
    fs.rename(req.file.path, newFilepath, async (err) => {
      if (err) {
        throw err;
      }
      dish.imageUrl = newFilepath;
      await dish.save();

      console.log("Rename successful");
    });

    res.status(200).json({
      success: true,
      message: USER_MESSAGES.dishUpdated,
      data: dish,
    });
  }
  static async partialUpdate(req, res) {
    const { id } = req.params;
    const dish = await db.Dish.findByPk(id);
    const { fieldName, fieldValue } = req.body;

    if (!dish) {
      return res.status(500).json({
        success: false,
        message: USER_MESSAGES.dishDoesntExist,
        errors: null,
      });
    }

    dish[fieldName] = fieldValue;
    await dish.save();

    res.status(200).json({
      success: true,
      message: USER_MESSAGES.dishUpdated,
      data: dish,
    });
  }
  static async delete(req, res) {
    const { id } = req.params;
    const dish = await db.Dish.findByPk(id);
    if (!dish) {
      return res.status(500).json({
        success: false,
        message: USER_MESSAGES.dishDoesntExist,
        errors: null,
      });
    }
    await dish.destroy();
    res
      .status(200)
      .json({ success: true, message: USER_MESSAGES.dishDeleted, data: dish });
  }
  static async getDishById(req, res) {
    const { id } = req.params;
    const dish = await db.Dish.findByPk(id);
    if (!dish) {
      return res.status(500).json({
        success: false,
        message: USER_MESSAGES.dishDoesntExist,
        errors: null,
      });
    }
    res.status(200).json({
      success: true,
      message: USER_MESSAGES.dishDisplayed,
      data: dish,
    });
  }
}
module.exports = DishController;
