const orderModel = require("../../../modules/orderModel");
const factory = require("../../handleFactor/handlerFactory");
const asyncHandler = require("express-async-handler");

// // //  @dec  change order status to admin Approved
// // //  @route  Put  /api/v1/orders/:orderId/approved
// // //  @access Protect/admin
// exports.passingOrderApprovedToReqBody = (req, res, next) => {
//   req.body = { status: 1, adminAcceptedAt: Date.now() };
//   next();
// };

// // //  @dec  change order status to Transit
// // //  @route  Put  /api/v1/orders/:orderId/transit
// // //  @access Protect/admin
// exports.passingOrderTransitToReqBody = (req, res, next) => {
//   req.body = { status: 2, adminCompletedAt: Date.now() };
//   next();
// };



// //  @dec  change order status
exports.orderUpdate = factory.updateOne(orderModel, "user order");





// //  @dec  get admin order
// //  @route  Get /api/v1/orders/admin
// //  @access private/admin
exports.getAllAdminOrder = factory.getAllData(orderModel, 'orders', orderModel);




// //  @dec  get order status number and sales today
// //  @route  Get /api/v1/orders/admin/status
// //  @access private/admin
exports.getOrderStats = asyncHandler(async (req, res) => {
  const result = await orderModel.aggregate([
    {
      $facet: {

        newOrders: [
          { $match: { status: 0 } },
          { $count: "count" }
        ],

         pendingOrders: [
          { $match: { status: 1 } },
          { $count: "count" }
        ],

        completeOrders: [
          { $match: { status: 4 } },
          { $count: "count" }
        ],

        cancelledOrders: [
          { $match: { status: 5 } },
          { $count: "count" }
        ],

        totalSalesToday: [
          {
            $match: {
               status: 4,
              createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalOrderPrice" }
            }
          }
        ]
      }
    },
    {
      $project: {
        newOrders: { $arrayElemAt: ["$newOrders.count", 0] },
        pendingOrders: { $arrayElemAt: ["$pendingOrders.count", 0] },
        completeOrders: { $arrayElemAt: ["$completeOrders.count", 0] },
        cancelledOrders: { $arrayElemAt: ["$cancelledOrders.count", 0] },
        totalSalesToday: { $ifNull: [{ $arrayElemAt: ["$totalSalesToday.total", 0] }, 0] }
      }
    }
  ]);


  //send success response
  res.status(200).json({
    status: true,
    message: "Success to get order status",
    data: result,
  });
});







