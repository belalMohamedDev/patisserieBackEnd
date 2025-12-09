const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const { v4: uuidv4 } = require("uuid");

const ms = require("ms");
const redisClient = require("../../config/redisConnection");

const userModel = require("../../modules/userModel");

const createToken = require("../../utils/generate token/createToken");

const { sanitizeUser } = require("../../utils/apiFeatures/sanitizeData");



// @ dec sign Up
// @ route Post  /api/vi/auth/signUp
// @ access Public
exports.signUp = asyncHandler(async (req, res, next) => {

  // create user
  const document = await userModel.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,

  });

  //generate token

  const sessionId = uuidv4();

  const expireSeconds = Math.floor(
    ms(process.env.JWT_EXPIER_REFRESH_TIME_TOKEN) / 1000,
  );
  const accessToken = createToken(
    { userId: document._id },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_ACCESS_TIME_TOKEN,
  );

  const refreshToken = createToken(
    { userId: document._id, sessionId },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    process.env.JWT_EXPIER_REFRESH_TIME_TOKEN,
  );
  await redisClient.set(
    `refreshToken:${document._id}:${sessionId}`,
    refreshToken,
    { EX: expireSeconds },
  );

  //send success response
  res.status(201).json({
    status: true,
    message: i18n.__("userSuccessfullySignedUp"),
    accessToken: accessToken,
    data: sanitizeUser(document, refreshToken),
  });
});



