const express = require("express");
const {
  completeDriverSignUp,
  resizeDriverIdsImages,
  uploadDriverIdsImages,
  uploadDriversImageIdInCloud,
} = require("../services/driverServices/auth/completeRegister");

const {
  getAllDriverOrders,
} = require("../services/driverServices/orders/getAllOrders");

const {
  acceptedOrderByDrivers,
} = require("../services/driverServices/orders/acceptOrder");

const {
  canceledOrderByDrivers,
} = require("../services/driverServices/orders/cancelOrder");

const {
  createFilterObject,
  getAllDeliveredOrder,
  createFilterObjectAcceptedOrder,
  createFilterObjectCancelledOrder,
} = require("../services/driverServices/orders/deliveredOrder");

const {
  activeDriverAccount,
  getAllNotActiveUserDriver,
  getAllActiveUserDriver,
} = require("../services/adminServices/approveDriver/adminApprove");

const authServices = require("../services/authServices/protect");
const {
  addLoggedUserDataInBody,
} = require("../services/user/userServices/UserService");
const {
  driverCompleteSignUpValidator,
} = require("../utils/validators/driverCompleteDataValidator");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - user
 *         - licenseNumber
 *         - vehicleInfo
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the driver
 *         user:
 *           type: string
 *           description: User ID associated with the driver
 *         licenseNumber:
 *           type: string
 *           description: Driver's license number
 *         licenseExpiry:
 *           type: string
 *           format: date
 *           description: License expiry date
 *         vehicleInfo:
 *           type: object
 *           description: Vehicle information
 *           properties:
 *             make:
 *               type: string
 *               description: Vehicle make
 *             model:
 *               type: string
 *               description: Vehicle model
 *             year:
 *               type: integer
 *               description: Vehicle year
 *             color:
 *               type: string
 *               description: Vehicle color
 *             plateNumber:
 *               type: string
 *               description: License plate number
 *         documents:
 *           type: object
 *           description: Driver documents
 *           properties:
 *             licenseImage:
 *               type: string
 *               description: License image URL
 *             vehicleRegistration:
 *               type: string
 *               description: Vehicle registration image URL
 *             insurance:
 *               type: string
 *               description: Insurance document image URL
 *         isActive:
 *           type: boolean
 *           default: false
 *           description: Whether the driver account is active
 *         isApproved:
 *           type: boolean
 *           default: false
 *           description: Whether the driver is approved by admin
 *         currentLocation:
 *           type: object
 *           description: Current driver location
 *           properties:
 *             latitude:
 *               type: number
 *               description: Latitude coordinate
 *             longitude:
 *               type: number
 *               description: Longitude coordinate
 *         rating:
 *           type: number
 *           default: 0
 *           description: Driver rating
 *         totalDeliveries:
 *           type: integer
 *           default: 0
 *           description: Total number of deliveries completed
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     DriverCompleteSignUp:
 *       type: object
 *       required:
 *         - licenseNumber
 *         - licenseExpiry
 *         - vehicleInfo
 *       properties:
 *         licenseNumber:
 *           type: string
 *           description: Driver's license number
 *         licenseExpiry:
 *           type: string
 *           format: date
 *           description: License expiry date
 *         vehicleInfo:
 *           type: object
 *           description: Vehicle information
 *           properties:
 *             make:
 *               type: string
 *               description: Vehicle make
 *             model:
 *               type: string
 *               description: Vehicle model
 *             year:
 *               type: integer
 *               description: Vehicle year
 *             color:
 *               type: string
 *               description: Vehicle color
 *             plateNumber:
 *               type: string
 *               description: License plate number
 *         licenseImage:
 *           type: string
 *           format: binary
 *           description: License image file
 *         vehicleRegistration:
 *           type: string
 *           format: binary
 *           description: Vehicle registration image file
 *         insurance:
 *           type: string
 *           format: binary
 *           description: Insurance document image file
 *     DriverOrder:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Order ID
 *         orderNumber:
 *           type: string
 *           description: Order number
 *         status:
 *           type: string
 *           enum: [pending, accepted, in_delivery, delivered, cancelled]
 *           description: Order status
 *         totalAmount:
 *           type: number
 *           description: Order total amount
 *         deliveryAddress:
 *           type: object
 *           description: Delivery address
 *           properties:
 *             address:
 *               type: string
 *               description: Full address
 *             city:
 *               type: string
 *               description: City
 *             coordinates:
 *               type: object
 *               description: Address coordinates
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *         customer:
 *           type: object
 *           description: Customer information
 *           properties:
 *             name:
 *               type: string
 *               description: Customer name
 *             phone:
 *               type: string
 *               description: Customer phone
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management API
 */

/**
 * @swagger
 * /v1/api/drivers/allDriverNotActive:
 *   get:
 *     summary: Get all inactive drivers (Admin only)
 *     tags: [Drivers]
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
 *         description: Inactive drivers retrieved successfully
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
 *                     $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/allDriverNotActive")
  .get(
    authServices.protect,
    authServices.allowedTo("admin"),
    getAllNotActiveUserDriver
  );

/**
 * @swagger
 * /v1/api/drivers/allDriverActive:
 *   get:
 *     summary: Get all active drivers (Admin only)
 *     tags: [Drivers]
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
 *         description: Active drivers retrieved successfully
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
 *                     $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/allDriverActive")
  .get(
    authServices.protect,
    authServices.allowedTo("admin"),
    getAllActiveUserDriver
  );

/**
 * @swagger
 * /v1/api/drivers/{id}/active:
 *   put:
 *     summary: Activate a driver account (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: Driver account activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id/active")
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    activeDriverAccount
  );

router.use(authServices.protect, authServices.allowedTo("delivery"));

/**
 * @swagger
 * /v1/api/drivers/getNewOrders:
 *   post:
 *     summary: Get new orders available for delivery (Driver only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 description: Driver's current latitude
 *               longitude:
 *                 type: number
 *                 description: Driver's current longitude
 *               radius:
 *                 type: number
 *                 default: 10
 *                 description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: New orders retrieved successfully
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DriverOrder'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/getNewOrders").post(getAllDriverOrders);

/**
 * @swagger
 * /v1/api/drivers/deliveredOrder:
 *   get:
 *     summary: Get all delivered orders by the driver (Driver only)
 *     tags: [Drivers]
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
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: Delivered orders retrieved successfully
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
 *                     $ref: '#/components/schemas/DriverOrder'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/deliveredOrder").get(createFilterObject, getAllDeliveredOrder);

/**
 * @swagger
 * /v1/api/drivers/cancelledOrder:
 *   get:
 *     summary: Get all cancelled orders by the driver (Driver only)
 *     tags: [Drivers]
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
 *         description: Cancelled orders retrieved successfully
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
 *                     $ref: '#/components/schemas/DriverOrder'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/cancelledOrder")
  .get(createFilterObjectCancelledOrder, getAllDeliveredOrder);

/**
 * @swagger
 * /v1/api/drivers/acceptedDeliveredOrder:
 *   get:
 *     summary: Get all accepted and delivered orders by the driver (Driver only)
 *     tags: [Drivers]
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
 *         description: Accepted and delivered orders retrieved successfully
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
 *                     $ref: '#/components/schemas/DriverOrder'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/acceptedDeliveredOrder")
  .get(createFilterObjectAcceptedOrder, getAllDeliveredOrder);

/**
 * @swagger
 * /v1/api/drivers/{orderId}/accept:
 *   put:
 *     summary: Accept an order for delivery (Driver only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/DriverOrder'
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
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/:orderId/accept").put(acceptedOrderByDrivers);

/**
 * @swagger
 * /v1/api/drivers/{orderId}/canceledOrder:
 *   delete:
 *     summary: Cancel an accepted order (Driver only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *               $ref: '#/components/schemas/Success'
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
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/:orderId/canceledOrder").delete(canceledOrderByDrivers);

/**
 * @swagger
 * /v1/api/drivers/complete:
 *   post:
 *     summary: Complete driver signup with documents (Driver only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - licenseNumber
 *               - licenseExpiry
 *               - vehicleInfo
 *               - licenseImage
 *               - vehicleRegistration
 *               - insurance
 *             properties:
 *               licenseNumber:
 *                 type: string
 *                 description: Driver's license number
 *               licenseExpiry:
 *                 type: string
 *                 format: date
 *                 description: License expiry date
 *               vehicleInfo:
 *                 type: string
 *                 description: JSON string of vehicle information
 *               licenseImage:
 *                 type: string
 *                 format: binary
 *                 description: License image file
 *               vehicleRegistration:
 *                 type: string
 *                 format: binary
 *                 description: Vehicle registration image file
 *               insurance:
 *                 type: string
 *                 format: binary
 *                 description: Insurance document image file
 *     responses:
 *       201:
 *         description: Driver signup completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
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
router
  .route("/complete")
  .post(
    uploadDriverIdsImages,
    resizeDriverIdsImages,
    addLoggedUserDataInBody,
    driverCompleteSignUpValidator,
    uploadDriversImageIdInCloud,
    completeDriverSignUp
  );

module.exports = router;
