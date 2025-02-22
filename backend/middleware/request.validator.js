const { USER_MESSAGES } = require("../constants/user.messages");
const { mapValidationError } = require("../misc");
const fs = require("fs");

// can be reused by many routes
const validate = (validations) => {
  return async (req, res, next) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        if (req.file) {
          fs.rm(req.file.path, (err) => {
            console.log("Removed temp file", err);
          });
        }

        return res.status(400).json({
          success: false,
          message: USER_MESSAGES.signupValidationFailed,
          errors: mapValidationError(result.array()),
        });
      }
    }

    next();
  };
};

module.exports = validate;
