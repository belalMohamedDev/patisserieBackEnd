const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const i18n = require("i18n");
const redisClient = require("../../config/redisConnection");

const ApiError = require("../../utils/apiError/apiError");
const createToken = require("../../utils/generate token/createToken");

// @ dec create new access token
// @ route Post  /api/vi/auth/token
// @ access Public
exports.newAccessToken = asyncHandler(async (req, res, next) => {
  let refreshToken;

  if (req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
  } else if (req.headers.authorization) {
    refreshToken = req.headers.authorization.split(" ")[1];
  }

  if (!refreshToken) {
    return next(new ApiError(i18n.__("refreshTokeRequired"), 400));
  }


  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    );
  } catch (err) {

    return next(new ApiError(i18n.__("invalidOrExpiredRefreshToken"), 401));
  }


  const { userId, sessionId } = decoded;

  const storedToken = await redisClient.get(
    `refreshToken:${userId}:${sessionId}`,
  );

  if (!storedToken || storedToken !== refreshToken) {
    return next(new ApiError(i18n.__("invalidOrExpiredRefreshToken"), 401));
  }


  const accessToken = createToken(
    { userId: document._id },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN,
  );




  res.status(201).json({
    status: true,
    message: i18n.__("successCreateAccessToken"),
    accessToken: accessToken,
  });
});






