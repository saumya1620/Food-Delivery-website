const express = require("express");
const OrderController = require("../controllers/order.controller");
const { body } = require("express-validator");
const validate = require("../middleware/request.validator");
const { validateToken, isAdmin } = require("../middleware/token.validator");
const UserController = require("../controllers/user.controller");
const { notify } = require("./user.router");
const { ORDER_STATUSES } = require("../constants/user.messages");

const router = express.Router();

const deliveryAddressFields = [
  "firstName",
  "lastName",
  "email",
  "street",
  "city",
  "state",
  "zipcode",
  "country",
  "phone",
];

const validations = {
  items: (key) =>
    body(key)
      .isArray({ min: 1 })
      .withMessage("Items must be a non-empty array")
      .custom((items) => {
        for (const item of items) {
          if (
            !item.dishId ||
            typeof item.dishId !== "number" ||
            !item.quantity ||
            typeof item.quantity !== "number"
          ) {
            throw new Error("Each item must have a valid dishId and quantity.");
          }
        }
        return true;
      }),
  amount: (key) => body(key).notEmpty().isFloat({ gt: 0 }),
  address: (key) =>
    body(key)
      .isObject()
      .withMessage("Delivery address required")
      .custom((address) => {
        deliveryAddressFields.map((addressKey) => {
          if (!address[addressKey]) {
            throw new Error(`${addressKey} required`);
          }
        });
        return true;
      }),
  status: (key) =>
    body(key)
      .optional()
      .isIn(Object.keys(ORDER_STATUSES))
      .withMessage("Invalid status"),
  deliveryFee: (key) => body(key).optional().isFloat({ gt: 0 }),
  discount: (key) => body(key).optional().isFloat({ gt: 0 }),
  payment: (key) => body(key).isBoolean(),
};

router.post(
  "/orders",
  validateToken,
  validate(Object.keys(validations).map((item) => validations[item](item))),
  OrderController.create
);

router.put(
  "/orders/:id",
  validateToken,
  validate(Object.keys(validations).map((item) => validations[item](item))),
  OrderController.update
);

router.patch(
  "/orders/:id",
  validateToken,
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
  OrderController.partialUpdate
);

router.delete("/orders/:id", validateToken, OrderController.delete);

router.get("/orders/:id", validateToken, OrderController.getOrderById);

router.get("/orders", validateToken, OrderController.fetchAll);

router.patch(
  "/orders/:id/update-status",
  validateToken,
  isAdmin,
  validate([
    body("status")
      .notEmpty()
      .isIn(Object.keys(ORDER_STATUSES))
      .withMessage("Invalid status"),
  ]),
  OrderController.updateStatus
);

module.exports = router;
