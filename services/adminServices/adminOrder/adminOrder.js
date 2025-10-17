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




// @desc  Get order status number, sales today, weekly sales & sold items
// @route  GET /api/v1/orders/admin/status
// @access private/admin
exports.getOrderStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const endOfToday = new Date(now.setHours(23, 59, 59, 999));

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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





        pendingDriver: [
          { $match: { status: 2 } },
          { $count: "count" }
        ],




        DeliveredOrders: [
          { $match: { status: 3 } },
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
              createdAt: { $gte: startOfToday, $lt: endOfToday }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalOrderPrice" }
            }
          }
        ],

        totalSalesLastWeek: [
          {
            $match: {
              status: 4,
              createdAt: { $gte: sevenDaysAgo, $lt: endOfToday }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalOrderPrice" }
            }
          }
        ],

        totalItemsSoldLastWeek: [
          {
            $match: {
              status: 4,
              createdAt: { $gte: sevenDaysAgo, $lt: endOfToday }
            }
          },
          { $unwind: "$cartItems" },
          {
            $group: {
              _id: null,
              totalItems: { $sum: "$cartItems.quantity" }
            }
          }
        ],

        topProducts: [
          {
            $match: {
              status: 4,
              createdAt: { $gte: sevenDaysAgo, $lt: endOfToday }
            }
          },
          { $unwind: "$cartItems" },
          {
            $group: {
              _id: "$cartItems.productId"
            }
          },
          { $count: "count" }
        ]
      }
    },
    {
      $project: {
        newOrders: { $ifNull: [{ $arrayElemAt: ["$newOrders.count", 0] }, 0] },
        pendingOrders: { $ifNull: [{ $arrayElemAt: ["$pendingOrders.count", 0] }, 0] },
        pendingDriver: { $ifNull: [{ $arrayElemAt: ["$pendingDriver.count", 0] }, 0] },
        DeliveredOrders: { $ifNull: [{ $arrayElemAt: ["$DeliveredOrders.count", 0] }, 0] },
        completeOrders: { $ifNull: [{ $arrayElemAt: ["$completeOrders.count", 0] }, 0] },
        cancelledOrders: { $ifNull: [{ $arrayElemAt: ["$cancelledOrders.count", 0] }, 0] },
        totalSalesToday: { $ifNull: [{ $arrayElemAt: ["$totalSalesToday.total", 0] }, 0] },
        totalSalesLastWeek: { $ifNull: [{ $arrayElemAt: ["$totalSalesLastWeek.total", 0] }, 0] },
        totalItemsSoldLastWeek: { $ifNull: [{ $arrayElemAt: ["$totalItemsSoldLastWeek.totalItems", 0] }, 0] },
        topProducts: { $ifNull: [{ $arrayElemAt: ["$topProducts.count", 0] }, 0] }
      }
    }
  ]);

  res.status(200).json({
    status: true,
    message: "Success to get order statistics",
    data: result[0],
  });
});







