const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  getAllAdmin,

} = require("../services/adminServices/userAdmins/adminServices");

const {
  updateAdminToUser

} = require("../services/adminServices/userAdmins/returnAdmionToUser");

const {
  resizeProfileImage, updateUserToAdminOrDelivery, uploadImageInCloud, uploadProfileImage

} = require("../services/adminServices/userAdmins/addUserToAdmin");


const router = express.Router();



router.use(authServices.protect, authServices.allowedTo("admin"));


router.route("/").get(getAllAdmin).post(
  uploadProfileImage,
  resizeProfileImage,
  uploadImageInCloud,
  updateUserToAdminOrDelivery
);



router.route("/:id").delete(updateAdminToUser);



module.exports = router;
