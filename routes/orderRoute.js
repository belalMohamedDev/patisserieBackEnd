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
  passingOrderApprovedToReqBody,

  passingOrderTransitToReqBody,
} = require("../services/adminServices/adminOrder/adminOrderStatus");

const {
  passingOrderDeliveredToReqBody,
} = require("../services/driverServices/orders/deliveredOrder");

const {
  getAllAdminCompleteOrder,
  getAllPendingAdminOrder,
  getAllAdminCancelOrder
} = require("../services/adminServices/adminOrder/getAdminOrder");

const {
  createCashOrderValidator,
} = require("../utils/validators/orderValidator");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - cartItems
 *         - totalOrderPrice
 *         - shippingAddress
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the order
 *         user:
 *           type: string
 *           description: User ID who placed the order
 *         cartItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: integer
 *                 description: Quantity ordered
 *               price:
 *                 type: number
 *                 description: Price per unit
 *               color:
 *                 type: string
 *                 description: Product color (if applicable)
 *         totalOrderPrice:
 *           type: number
 *           description: Total price of the order
 *         shippingAddress:
 *           type: object
 *           properties:
 *             details:
 *               type: string
 *             phone:
 *               type: string
 *             city:
 *               type: string
 *             postalCode:
 *               type: string
 *         paymentMethodType:
 *           type: string
 *           enum: [card, cash]
 *           default: cash
 *           description: Payment method used
 *         isPaid:
 *           type: boolean
 *           default: false
 *           description: Whether the order has been paid
 *         paidAt:
 *           type: string
 *           format: date-time
 *           description: When the order was paid
 *         isDelivered:
 *           type: boolean
 *           default: false
 *           description: Whether the order has been delivered
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           description: When the order was delivered
 *         status:
 *           type: string
 *           enum: [pending, approved, transit, delivered, cancelled]
 *           default: pending
 *           description: Current order status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderCreate:
 *       type: object
 *       required:
 *         - shippingAddress
 *         - paymentMethodType
 *       properties:
 *         shippingAddress:
 *           type: object
 *           required:
 *             - details
 *             - phone
 *             - city
 *             - postalCode
 *           properties:
 *             details:
 *               type: string
 *               description: Detailed shipping address
 *             phone:
 *               type: string
 *               description: Contact phone number
 *             city:
 *               type: string
 *               description: City name
 *             postalCode:
 *               type: string
 *               description: Postal/ZIP code
 *         paymentMethodType:
 *           type: string
 *           enum: [card, cash]
 *           description: Payment method to use
 *     OrderStatusUpdate:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [approved, transit, delivered, cancelled]
 *           description: New order status
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */

router.use(authServices.protect);

//admin

/**
 * @swagger
 * /v1/api/order/{id}/approveByAdmin:
 *   put:
 *     summary: Approve order by admin
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id/approveByAdmin")
  .put(
    authServices.allowedTo("admin"),
    passingOrderApprovedToReqBody,
    orderUpdate
  );

/**
 * @swagger
 * /v1/api/order/{id}/delivered:
 *   put:
 *     summary: Mark order as delivered by driver
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order marked as delivered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id/delivered")
  .put(
    authServices.allowedTo("delivery"),
    passingOrderDeliveredToReqBody,
    orderUpdate
  );

/**
 * @swagger
 * /v1/api/order/{id}/transit:
 *   put:
 *     summary: Mark order as in transit
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order marked as in transit successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/:id/transit").put(passingOrderTransitToReqBody, orderUpdate);

/**
 * @swagger
 * /v1/api/order/admin/pending:
 *   get:
 *     summary: Get all pending orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Pending orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/admin/pending")
  .get(authServices.allowedTo("admin"), getAllPendingAdminOrder);


  router
  .route("/admin/cancel")
  .get(authServices.allowedTo("admin"), getAllAdminCancelOrder);

/**
 * @swagger
 * /v1/api/order/admin:
 *   get:
 *     summary: Get all completed orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Completed orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/admin")
  .get(authServices.allowedTo("admin"), getAllAdminCompleteOrder);

//user
router.use(authServices.allowedTo("user"));

/**
 * @swagger
 * /v1/api/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreate'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/").post(createCashOrderValidator, createCashOrder);

/**
 * @swagger
 * /v1/api/order/checkOut-session/{cartId}:
 *   get:
 *     summary: Create checkout session for payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 session:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Stripe session ID
 *                     url:
 *                       type: string
 *                       description: Checkout URL
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/checkOut-session/:cartId").get(checkOutSession);

/**
 * @swagger
 * /v1/api/order/user:
 *   get:
 *     summary: Get all completed orders for current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User's completed orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/user")
  .get(createFilterObjectToGetAllCompleteUserOrder, getAllUserOrder);

/**
 * @swagger
 * /v1/api/order/user/pending:
 *   get:
 *     summary: Get all pending orders for current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User's pending orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/user/pending")
  .get(createFilterObjectToGetAllPendingUserOrder, getAllUserOrder);

/**
 * @swagger
 * /v1/api/order/{id}/cancelled:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id/cancelled")
  .put(passingOrderCancelledToReqBody, orderCancelled);

module.exports = router;
