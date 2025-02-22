const { verifyJwtToken } = require("../misc");

function validateToken(req, res, next) {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    verifyJwtToken(token, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded;
      console.log("Decoded user:", req.user, decoded);
      next();
    });
  } else {
    res.status(401);
    throw new Error("Token not provided.");
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are not allowed to perform this action");
  }
  next();
}

module.exports = { validateToken, isAdmin };
