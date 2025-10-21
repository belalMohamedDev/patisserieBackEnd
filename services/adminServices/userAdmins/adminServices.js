const userModel = require("../../../modules/userModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");

// @desc Get all  user ADMINS
// @route GET /api/v1/admin
// @access Private to admin
exports.getAllAdmin = asyncHandler(
  async (req, res) => {
  const document = await userModel.find({
    role: "admin",
 
  }).sort({
    active: -1,
  }).populate({
    path: "storeAddress",
    select: "location region briefness BranchArea", 
  });


  const totalAdmins = document.length;
  const activeAdmins = document.filter((d) => d.active === true).length;
  const inactiveAdmins = document.filter((d) => d.active === false).length;

  //send success response
  res.status(200).json({
    status: true,
    total: totalAdmins,
    active: activeAdmins,
    inactive: inactiveAdmins,
    message: i18n.__("SuccessToGetAllDataFor") + i18n.__("admin"),
    data: sanitizeUser(document),
  });
});



