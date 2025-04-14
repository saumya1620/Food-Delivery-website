const { USER_MESSAGES } = require("../constants/user.messages");
const fs = require("fs");
const db = require("../models");
const { Op } = require("sequelize");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const path = require("path");

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
      limit: limit || 1000,
    });
    res.status(200).json({
      success: true,
      message: USER_MESSAGES.fetchAllDishes,
      data: dishes,
    });
  }
  static async create(req, res) {
    const { name, description, categoryId, price, type } = req.body;

    const transaction = await db.sequelize.transaction();
    try {
      // Create the dish entry in the database first
      const dish = await db.Dish.create(
        {
          name: name,
          description: description,
          categoryId: categoryId,
          price: price,
          type: type,
        },
        { transaction }
      );

      // Create a unique file name for Cloudinary (to prevent name conflicts)
      const newFilepath =
        dish.id + "-" + req.file.originalname.split(".").shift();

      // Create the upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          tags: ["dishes"],
          public_id: newFilepath, // Correct variable used here
          folder: "dishes",
        },
        async (error, result) => {
          if (error) {
            console.log("Upload failed:", error);
            await transaction.rollback();
            return res.status(500).json({
              success: false,
              message: "Failed to upload dish image",
              errors: error,
            });
          }

          console.log("Upload successful!");

          // Once uploaded, save the Cloudinary image URL to the dish
          dish.imageUrl = result.secure_url; // Use the result object from Cloudinary
          await dish.save({ transaction });

          // Commit the transaction after all operations are successful
          await transaction.commit();

          fs.rm(req.file.path, (err) => {
            console.log("Removed temp file", err);
          });

          return res.status(200).json({
            success: true,
            message: "Dish created successfully",
            data: dish,
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      // Stream the file to Cloudinary
      const fileStream = fs.createReadStream(req.file.path);
      fileStream.pipe(uploadStream); // Pipe the file to Cloudinary
    } catch (error) {
      // Rollback transaction in case of error
      await transaction.rollback();
      console.error("Error during dish creation:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create dish",
        errors: error.message,
      });
    }
  }

  // static async create(req, res) {
  //   const { name, description, categoryId, price, type } = req.body;
  //   const transaction = await db.sequelize.transaction();

  //   try {
  //     const dish = await db.Dish.create(
  //       { name, description, categoryId, price, type },
  //       { transaction }
  //     );

  //     const filePath = req.file.path;
  //     const timestamp = Math.floor(Date.now() / 1000);
  //     const public_id = `${dish.id}-${req.file.originalname
  //       .split(".")
  //       .shift()}`;
  //     const folder = "dishes";
  //     const tags = "dishes";

  //     // String to sign must match Cloudinary's format (sorted params alphabetically)
  //     const stringToSign = `folder=${folder}&public_id=${public_id}&tags=${tags}&timestamp=${timestamp}${
  //       cloudinary.config().api_secret
  //     }`;
  //     const signature = crypto
  //       .createHash("sha1")
  //       .update(stringToSign)
  //       .digest("hex");

  //     const result = await cloudinary.uploader.upload(filePath, {
  //       folder,
  //       public_id,
  //       tags,
  //       timestamp,
  //       signature,
  //       api_key: cloudinary.config().api_key,
  //     });

  //     dish.imageUrl = result.secure_url;
  //     await dish.save({ transaction });
  //     await transaction.commit();

  //     fs.rm(filePath, (err) => {
  //       if (err) console.error("Failed to delete temp file:", err);
  //     });

  //     return res.status(200).json({
  //       success: true,
  //       message: "Dish created successfully",
  //       data: dish,
  //       url: result.secure_url,
  //       public_id: result.public_id,
  //     });
  //   } catch (error) {
  //     await transaction.rollback();
  //     console.error("Upload failed:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Failed to create dish",
  //       errors: error.message,
  //     });
  //   }
  // }

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
