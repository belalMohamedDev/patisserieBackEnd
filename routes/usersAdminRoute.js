const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  getAllAdmin,
  getInActiveAdmin,
} = require("../services/adminServices/userAdmins/adminServices");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the admin user
 *         name:
 *           type: string
 *           description: Admin user's full name
 *         email:
 *           type: string
 *           format: email
 *           description: Admin user's email address
 *         phone:
 *           type: string
 *           description: Admin user's phone number
 *         role:
 *           type: string
 *           enum: [admin, super_admin]
 *           description: Admin user role
 *         avatar:
 *           type: string
 *           description: Admin user's avatar image URL
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the admin account is active
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Last login timestamp
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of permissions granted to the admin
 *         department:
 *           type: string
 *           description: Admin's department or area of responsibility
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
 *   name: AdminUsers
 *   description: Admin user management API
 */

router.use(authServices.protect, authServices.allowedTo("admin"));

/**
 * @swagger
 * /v1/api/usersAdmin:
 *   get:
 *     summary: Get all active admin users (Admin only)
 *     tags: [AdminUsers]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, super_admin]
 *         description: Filter by admin role
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Active admin users retrieved successfully
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
 *                     $ref: '#/components/schemas/AdminUser'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/").get(getAllAdmin);

/**
 * @swagger
 * /v1/api/usersAdmin/inActive:
 *   get:
 *     summary: Get all inactive admin users (Admin only)
 *     tags: [AdminUsers]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, super_admin]
 *         description: Filter by admin role
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Inactive admin users retrieved successfully
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
 *                     $ref: '#/components/schemas/AdminUser'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/inActive").get(getInActiveAdmin);

module.exports = router;
