const { USER_MESSAGES } = require("../constants/user.messages");
const db = require("../models");
class FoodCategoryController {
  static async checkIfNotExist(value) {
    const existingCategory = await db.FoodCategory.findByPk(value);
    if (!existingCategory) {
      throw new Error(USER_MESSAGES.foodCategoryNotFound);
    }
  }
  static async fetchAll(req, res) {
    const categories = await db.FoodCategory.findAll({
      where: { status: "Active" },
    });
    res.status(200).json({
      success: true,
      message: USER_MESSAGES.fetchAllCategories,
      data: categories,
    });
  }
}
module.exports = FoodCategoryController;
