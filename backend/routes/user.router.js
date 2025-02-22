const express = require("express");
const validate = require("../middleware/request.validator");
const { body } = require("express-validator");
const UserController = require("../controllers/user.controller");
const { validateToken } = require("../middleware/token.validator");
const OrderController = require("../controllers/order.controller");
const router = express.Router();

router.post(
  "/signup",
  validate([
    body("fname").notEmpty().trim().escape(),
    body("lname").notEmpty().trim().escape(),
    body("email")
      .notEmpty()
      .isEmail()
      .trim()
      .escape()
      .custom(UserController.checkIfExistByEmail),
    body("password").notEmpty().isLength({ min: 6, max: 10 }).trim().escape(),
    body("confirmPassword")
      .notEmpty()
      .isLength({ min: 6, max: 10 })
      .trim()
      .escape()
      .custom((value, { req }) => {
        return value === req.body.password;
      }),
  ]),
  UserController.signup
);

router.post(
  "/signin",
  validate([
    body("email").notEmpty().isEmail().trim().escape(),
    body("password").notEmpty().trim().escape(),
  ]),
  UserController.signin
);

module.exports = router;
