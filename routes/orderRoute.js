const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  checkOutSession,
  createCashOrder,
} = require("../services/user/userOrder/orderServices");

const {
  createFilterObjectToGetAllCompleteUserOrder,
  createFilterObjectToGetAllPendingUserOrder,
  getAllUserOrder,
  orderCancelled,
  passingOrderCancelledToReqBody,
} = require("../services/user/userOrder/userOrder");

const {
  orderUpdate,
  getAllAdminOrder, getOrderStats
} = require("../services/adminServices/adminOrder/adminOrder");

const {
  passingOrderDeliveredToReqBody,
} = require("../services/driverServices/orders/deliveredOrder");


const {
  createCashOrderValidator,
} = require("../utils/validators/orderValidator");

const router = express.Router();



router.use(authServices.protect);


router
  .route("/admin/:id")
  .put(
    authServices.allowedTo("admin"),
    orderUpdate
  );


router
  .route("/:id/delivered")
  .put(
    authServices.allowedTo("delivery"),
    passingOrderDeliveredToReqBody,
    orderUpdate
  );






router
  .route("/admin")
  .get(authServices.allowedTo("admin"), getAllAdminOrder);


router
  .route("/admin/status")
  .get(authServices.allowedTo("admin"), getOrderStats);

//user
router.use(authServices.allowedTo("user"));


router.route("/").post(createCashOrderValidator, createCashOrder);

router.route("/checkOut-session/:cartId").get(checkOutSession);


router
  .route("/user")
  .get(createFilterObjectToGetAllCompleteUserOrder, getAllUserOrder);


router
  .route("/user/pending")
  .get(createFilterObjectToGetAllPendingUserOrder, getAllUserOrder);


router
  .route("/:id/cancelled")
  .put(passingOrderCancelledToReqBody, orderCancelled);

module.exports = router;
