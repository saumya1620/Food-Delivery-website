const USER_MESSAGES = {
  userAlreadyExist: "User already exist with email",
  userCreated: "User has been created successfully",
  userDoesntExist: "User doesn't exist with given id",
  signupValidationFailed: "User signup validation failed",
  invalidLoginOrPassword: "Invalid email or password",
  userSigninSuccess: "User signed in successfully",
  dishAlreadyExist: "Dish already exists with the name",
  foodCategoryNotFound: "Food category does not exist",
  fetchAllDishes: "All dishes",
  dishCreated: "Dish has been added successfully",
  dishUpdated: "Dish has been updated successfully",
  dishDoesntExist: "Dish does'nt exist with the provided id",
  dishDeleted: "Dish deleted successfully",
  dishDisplayed: "Dish displayed",
  fetchAllCategories: "All active food categories",
  orderCreated: "Order has been created successfully",
  orderDoesntExist: "Order doesn't exist with given id",
  orderUpdated: "Order has been updated",
  orderDoesntExist: "Order doesn't exist",
  orderDisplayed: "Order displayed",
};
// const STATUSES = {
//     ok : 'OK',
//     cancel : ''
// }

const ORDER_STATUSES = {
  Pending: "Pending",
  Accepted: "Food Processing",
  Processing: "Preparing Food",
  OutForDelivery: "Out for Delivery",
  Delivered: "Delivered",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
};
module.exports = { USER_MESSAGES, ORDER_STATUSES };
