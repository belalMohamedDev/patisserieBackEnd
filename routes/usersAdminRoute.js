const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  getAllAdmin,

} = require("../services/adminServices/userAdmins/adminServices");

const router = express.Router();



router.use(authServices.protect, authServices.allowedTo("admin"));


router.route("/").get(getAllAdmin);





module.exports = router;
