const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const userModel = require("../../../modules/userModel");
const i18n = require("i18n");
const ms = require("ms");
const { v4: uuidv4 } = require("uuid");

const redisClient = require("../../../config/redisConnection");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");

const creatToken = require("../../../utils/generate token/createToken");

// @ dec update logged user password
// @ route Update  /api/vi/user/updateMyPassword
// @ access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //update user password based user payload
  const document = await userModel.findByIdAndUpdate(
    req.userModel._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );


  //generate token
  const sessionId = uuidv4();

  const expireSeconds = Math.floor(
    ms(process.env.JWT_EXPIER_REFRESH_TIME_TOKEN) / 1000,
  );

  const accessToken = creatToken(
    document._id,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN
  );
  const refreshToken = creatToken(
    document._id,
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_REFRESH_TIME_TOKEN
  );

  await redisClient.set(
    `refreshToken:${document._id}:${sessionId}`,
    refreshToken,
    { EX: expireSeconds },
  );


  res.status(200).json({
    status: true,
    message: i18n.__("sucessToUpdateUserPassword"),
    accessToken: accessToken,
    data: sanitizeUser(document, refreshToken),
  });
});
