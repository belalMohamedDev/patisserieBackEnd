const jwt = require("jsonwebtoken");

// @ dec this func to create token , use in login and signup
const createToken = (payload, secretKey, expiresIn) =>
  jwt.sign(payload, secretKey, { expiresIn });


module.exports = createToken;



