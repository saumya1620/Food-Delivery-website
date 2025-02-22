const { matchedData } = require("express-validator");
const db = require("../models");
const { USER_MESSAGES } = require("../constants/user.messages");
const {
  genPasswordHash,
  validatePasswordHash,
  genJwtToken,
} = require("../misc");

class UserController {
  static async checkIfExistByEmail(email) {
    const existingUser = await db.User.findOne({ where: { email: email } });
    if (existingUser) {
      throw new Error(USER_MESSAGES.userAlreadyExist);
    }
  }
  static async checkIfExistById(id) {
    const existingUser = await db.User.findByPk(id);
    if (existingUser) {
      throw new Error(USER_MESSAGES.userAlreadyExist);
    }
  }
  static async checkIfNotExistsById(id) {
    const existingUser = await db.User.findByPk(id);
    if (!existingUser) {
      throw new Error(USER_MESSAGES.userDoesntExist);
    }
  }

  static async signup(req, res) {
    //1. take input name email pwd req.body
    let { fname, lname, email, password, confirmPassword } = matchedData(req);
    //2. Validate the input data
    const user = await db.User.create({
      firstName: fname,
      lastName: lname,
      email: email,
      password: genPasswordHash(password),
    });
    res
      .status(200)
      .json({ success: true, message: USER_MESSAGES.userCreated, data: user });
  }
  static async signin(req, res) {
    let { email, password } = matchedData(req);
    const foundUser = await db.User.findOne({ where: { email: email } });

    if (!foundUser) {
      return res.status(400).json({
        success: false,
        message: USER_MESSAGES.invalidLoginOrPassword,
        errors: null,
      });
    }
    if (!validatePasswordHash(password, foundUser.password)) {
      return res.status(400).json({
        success: false,
        message: USER_MESSAGES.invalidLoginOrPassword,
        errors: null,
      });
    }

    res.status(200).json({
      success: true,
      message: USER_MESSAGES.userSigninSuccess,
      data: {
        token: genJwtToken({
          userId: foundUser.id,
          fullName: `${foundUser.firstName} ${foundUser.lastName}`,
          role: foundUser.role,
        }),
      },
    });
  }
}
module.exports = UserController;
