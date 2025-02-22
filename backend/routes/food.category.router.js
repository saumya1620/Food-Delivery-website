const express = require("express");
const FoodCategoryController = require("../controllers/food.category.controller");
const router = express.Router();

router.get("/food-categories", FoodCategoryController.fetchAll);

module.exports = router;
