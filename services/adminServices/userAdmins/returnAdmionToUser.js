const userModel = require("../../../modules/userModel");
const asyncHandler = require("express-async-handler");
const i18n = require("i18n");
const { sanitizeUser } = require("../../../utils/apiFeatures/sanitizeData");


// @desc Update admin role to user
// @route DELETE /api/v1/admin
// @access Private (admin only)
exports.updateAdminToUser = asyncHandler(async (req, res) => {
    const { id } = req.params; // note: params not param

    // validate id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: false,
            message: i18n.__("InvalidId"), // ensure this key exists in your locales
        });
    }

    // Optional: prevent admin from demoting themself (if you have req.user populated)
    if (req.userModel && req.userModel.id === id) {
        return res.status(403).json({
            status: false,
            message: i18n.__("CannotDemoteYourself"),
        });
    }

    // 1) Check user exists
    const user = await userModel.findById(id);

    if (!user) {
        return res.status(404).json({
            status: false,
            message: i18n.__("UserNotFound"),
        });
    }

    // 2) Convert admin to normal user (clean admin-only fields)
    user.role = "user";
    user.storeAddress = null;

    await user.save();

    // 3) Send success response
    res.status(200).json({
        status: true,
        message: i18n.__("SuccessToUpdate") + " " + i18n.__("user"),
        data: sanitizeUser(user),
    });
});