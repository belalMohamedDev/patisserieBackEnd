const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  getAllAdmin,
  getInActiveAdmin,
} = require("../services/adminServices/userAdmins/adminServices");

const router = express.Router();



router.use(authServices.protect, authServices.allowedTo("admin"));


router.route("/data").get(getAllAdmin);


router.route("/inActive").get(getInActiveAdmin);

module.exports = router;
