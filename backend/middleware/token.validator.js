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

function verifyCashfreeSignature(req, res, next) {
  const body = req.headers["x-webhook-timestamp"] + req.rawBody;
  const secretKey = process.env.CASHFREE_API_SECRET;
  let generatedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(body)
    .digest("base64");
  const signature = req.headers["x-webhook-signature"];

  console.log(
    "cashfree signature validation",
    req.rawBody,
    signature,
    generatedSignature
  );
  if (generatedSignature === signature) {
    let jsonObject = JSON.parse(rawBody);
    req.cashfree = jsonObject;
    next();
  }

  throw new Error("Generated signature and received signature did not match.");
}

module.exports = { validateToken, isAdmin, verifyCashfreeSignature };
