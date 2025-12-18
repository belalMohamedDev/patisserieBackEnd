const i18n = require("i18n");
const orderModel = require("../../../modules/orderModel");
const asyncHandler = require("express-async-handler");


// @desc    Add payment (deposit / installment) to order
// @route   POST /api/v1/orders/:orderId/payments
// @access  Private (admin)

exports.addPaymentToOrder = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  const { orderId } = req.params;

  if (!amount || amount <= 0) {
    return next(new ApiError(i18n.__("invalidAmount"), 400));
  }

  const order = await orderModel.findById(orderId);

  if (!order) {
    return next(new ApiError(i18n.__("orderNotFound"), 404));
  }


  const totalPaid = order.payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const remaining = order.totalOrderPrice - totalPaid;

  if (amount > remaining) {
    return next(
      new ApiError(i18n.__("amountExceedsRemaining"), 400)
    );
  }


  order.payments.push({
    amount,
    paidBy: req.userModel._id,
    paidAt: new Date(),
  });

  await order.save(); 

  return res.status(200).json({
    status: true,
    message: i18n.__("paymentAddedSuccessfully"),
    data: order,
  });
});
