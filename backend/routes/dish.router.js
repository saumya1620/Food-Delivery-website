const express = require("express");
const DishController = require("../controllers/dish.controller");
const { body } = require("express-validator");
const validate = require("../middleware/request.validator");
const router = express.Router();
const multer = require("multer");
const { validateToken, isAdmin } = require("../middleware/token.validator");
const FoodCategoryController = require("../controllers/food.category.controller");
const upload = multer({
  dest: "tempUpload",
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only supported jpeg, jpg or png.", false)
      );
    }
  },
});

const validations = {
  name: (key) =>
    body(key)
      .notEmpty()
      .isLength({ min: 3, max: 70 })
      .trim()
      .escape()
      //.isAlpha()
      .custom(DishController.checkIfExist),
  description: (key) =>
    body(key).notEmpty().isLength({ min: 5, max: 250 }).trim().escape(),
  categoryId: (key) =>
    body(key)
      .notEmpty()
      .isInt({ gt: 0 })
      .custom(FoodCategoryController.checkIfNotExist),
  price: (key) => body(key).notEmpty().isFloat({ gt: 0 }),
  type: (key) => body(key).notEmpty().isIn(["Veg", "Non-Veg"]).trim().escape(),
};

router.post(
  "/dishes",
  validateToken,
  isAdmin,
  upload.single("dishImage"),
  validate(Object.keys(validations).map((item) => validations[item](item))),
  DishController.create
);

router.put(
  "/dishes/:id",
  validateToken,
  isAdmin,
  upload.single("dishImage"),
  validate(Object.keys(validations).map((item) => validations[item](item))),
  DishController.update
);

router.patch(
  "/dishes/:id",
  validateToken,
  isAdmin,
  validate([
    body("fieldName").isString().withMessage("Field name must be a string"),
    body("fieldValue").custom((value, { req }) => {
      const fieldName = req.body.fieldName;
      if (validations[fieldName]) {
        return validations[fieldName]("fieldValue");
      }
      throw new Error("Unknown field name");
    }),
  ]),
  DishController.partialUpdate
);
router.delete("/dishes/:id", validateToken, isAdmin, DishController.delete);

router.get("/dishes/:id", DishController.getDishById);

router.get("/dishes", DishController.fetchAll);

module.exports = router;
