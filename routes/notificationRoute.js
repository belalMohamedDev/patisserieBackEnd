const express = require("express");
const {
  getAllNotificationToAdmin,
  repeatNotification,
  createNotification,
  getAllNotification,
  updateUnseenNotificationsToSeen,
  deleteNotificationToUser,
} = require("../services/notificationServices/notification");
const authServices = require("../services/authServices/protect");

const {
  createNotificationValidator,
} = require("../utils/validators/notificationValidator");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - title
 *         - message
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the notification
 *         title:
 *           type: string
 *           description: Notification title
 *         message:
 *           type: string
 *           description: Notification message content
 *         type:
 *           type: string
 *           enum: [info, success, warning, error, order, promotion]
 *           description: Type of notification
 *         user:
 *           type: string
 *           description: User ID who should receive the notification
 *         isRead:
 *           type: boolean
 *           default: false
 *           description: Whether the notification has been read
 *         isSeen:
 *           type: boolean
 *           default: false
 *           description: Whether the notification has been seen
 *         data:
 *           type: object
 *           description: Additional data related to the notification
 *           properties:
 *             orderId:
 *               type: string
 *               description: Related order ID
 *             productId:
 *               type: string
 *               description: Related product ID
 *             link:
 *               type: string
 *               description: Link to related content
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           default: medium
 *           description: Notification priority level
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Notification expiration date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     NotificationCreate:
 *       type: object
 *       required:
 *         - title
 *         - message
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: Notification title
 *         message:
 *           type: string
 *           description: Notification message content
 *         type:
 *           type: string
 *           enum: [info, success, warning, error, order, promotion]
 *           description: Type of notification
 *         user:
 *           type: string
 *           description: User ID who should receive the notification
 *         data:
 *           type: object
 *           description: Additional data related to the notification
 *           properties:
 *             orderId:
 *               type: string
 *               description: Related order ID
 *             productId:
 *               type: string
 *               description: Related product ID
 *             link:
 *               type: string
 *               description: Link to related content
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *           default: medium
 *           description: Notification priority level
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Notification expiration date
 *     NotificationRepeat:
 *       type: object
 *       required:
 *         - notificationId
 *       properties:
 *         notificationId:
 *           type: string
 *           description: ID of the notification to repeat
 *         users:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs to send the notification to
 */

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management API
 */

router.use(authServices.protect);

/**
 * @swagger
 * /v1/api/notifications/user:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
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
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: isSeen
 *         schema:
 *           type: boolean
 *         description: Filter by seen status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [info, success, warning, error, order, promotion]
 *         description: Filter by notification type
 *     responses:
 *       200:
 *         description: User notifications retrieved successfully
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
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/user").get(getAllNotification);

/**
 * @swagger
 * /v1/api/notifications/user/{id}:
 *   delete:
 *     summary: Delete a specific notification for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/user/:id").delete(deleteNotificationToUser);

/**
 * @swagger
 * /v1/api/notifications/user/seen:
 *   put:
 *     summary: Mark all unseen notifications as seen for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as seen successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedCount:
 *                       type: integer
 *                       description: Number of notifications updated
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/user/seen").put(updateUnseenNotificationsToSeen);

router.use(authServices.allowedTo("admin"));

/**
 * @swagger
 * /v1/api/notifications:
 *   get:
 *     summary: Get all notifications (Admin only)
 *     tags: [Notifications]
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
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [info, success, warning, error, order, promotion]
 *         description: Filter by notification type
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filter by priority level
 *     responses:
 *       200:
 *         description: All notifications retrieved successfully
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
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationCreate'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
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
  .route("/")
  .get(getAllNotificationToAdmin)
  .post(createNotificationValidator, createNotification);

/**
 * @swagger
 * /v1/api/notifications/repeat:
 *   post:
 *     summary: Repeat a notification to multiple users (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationRepeat'
 *     responses:
 *       200:
 *         description: Notification repeated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: object
 *                   properties:
 *                     sentCount:
 *                       type: integer
 *                       description: Number of notifications sent
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
 *         description: Original notification not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/repeat").post(repeatNotification);

module.exports = router;
