const asyncHandler = require("express-async-handler");
const orderModel = require("../../../modules/orderModel");



// //  @dec  get all pending  order to admin
// //  @route  Get /api/v1/orders/admin/pending
// //  @access private/admin

exports.getAllPendingAdminOrder = asyncHandler(async (req, res, next) => {
  const lang = req.headers["lang"] || "en";

  const pendingAdminOrders = await orderModel.find({
    nearbyStoreAddress: req.userModel.storeAddress,
    status: 0,
  }).setOptions({ lang }); 


      const localizedDocument = orderModel.schema.methods.toJSONLocalizedOnly(
      pendingAdminOrders,
      lang
    );


  res.status(200).send({
    status: true,
    message: "Successfully retrieved all pending orders for admin",
    data: localizedDocument,
  });
});


// //  @dec  get all admin order
// //  @route  Get /api/v1/orders/admin
// //  @access private/admin
exports.getAllAdminCompleteOrder = asyncHandler(async (req, res, next) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  const compeleteAdminOrders = await orderModel.find({
    nearbyStoreAddress: req.userModel.storeAddress,
    status: { $in: [4, 5] },
    createdAt: { $gte: start, $lte: end },
  });

  res.status(200).send({
    status: true,
    message: "Successfully retrieved all orders",
    data: compeleteAdminOrders,
  });
});
