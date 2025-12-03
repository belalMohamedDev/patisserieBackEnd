const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const i18n = require("i18n");
const redisClient = require("../../config/redisConnection");
const ApiError = require("../../utils/apiError/apiError");

// @ dec log out
// @ route Post  /api/vi/auth/logout
// @ access Public

exports.logOut = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    console.log("err")
    return next(new ApiError(i18n.__("refreshTokenRequired"), 400));
  }


  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );
  } catch (err) {
  
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  const { userId, sessionId } = decoded;



  const tokenKey = `refreshToken:${userId}:${sessionId}`;

  const isExist = await redisClient.get(tokenKey);

  if (!isExist) {
    return next(new ApiError(i18n.__("invalidRefreshToken"), 400));
  }

  await redisClient.del(tokenKey);

  res.status(200).json({
    status: true,
    message: i18n.__("loggedOutSuccessfully"),
  });
});