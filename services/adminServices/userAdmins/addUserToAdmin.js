const userModel = require("../../../modules/userModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");
const { uploadToCloudinary } = require("../../middleware/cloudinaryMiddleWare");
const { uploadSingleImage } = require("../../middleware/imageUploadMiddleware");
const { resizeImage } = require("../../middleware/resizeImage");

//upload single image
exports.uploadProfileImage = uploadSingleImage("image");

// resize image before upload
exports.resizeProfileImage = resizeImage();

// upload image in cloud
exports.uploadImageInCloud = uploadToCloudinary("adminProfile");

// @desc Update user role to admin
// @route POST /api/v1/admin
// @access Private (admin only)
exports.updateUserToAdmin = asyncHandler(async (req, res) => {
    const { email, storeAddress } = req.body;

    // 1) Check user exists
    const user = await userModel.findOne({ email });
    
    if (!user) {
        return res.status(404).json({
            status: false,
            message: i18n.__("UserNotFound"),
        });
    }

    // 2) Update role
    user.role = "admin";
    user.storeAddress = storeAddress;
    user.image = req.body.image;
    user.publicId = req.body.publicId;
    user.completeData = true;


    await user.save();

    // 3) Send response
    res.status(200).json({
        status: true,
        message: i18n.__("SuccessToUpdate") + " " + i18n.__("admin"),
        data: sanitizeUser(user),
    });
});
