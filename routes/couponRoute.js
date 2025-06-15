const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  getCoupons,
  UpdateCoupon,
  deleteCoupon,
  createCoupon,
  getAllCoupons,
} = require("../services/couponServices/couponServices");

const {
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
  getCouponValidator,
} = require("../utils/validators/couponValidator");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       required:
 *         - code
 *         - discount
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the coupon
 *         code:
 *           type: string
 *           description: Unique coupon code
 *         discount:
 *           type: number
 *           description: Discount amount or percentage
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Type of discount (percentage or fixed amount)
 *         description:
 *           type: string
 *           description: Coupon description
 *         minimumAmount:
 *           type: number
 *           description: Minimum order amount required to use coupon
 *         maximumDiscount:
 *           type: number
 *           description: Maximum discount amount allowed
 *         usageLimit:
 *           type: integer
 *           description: Maximum number of times coupon can be used
 *         usedCount:
 *           type: integer
 *           default: 0
 *           description: Number of times coupon has been used
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Coupon start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Coupon end date
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the coupon is active
 *         applicableCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: Categories where coupon can be applied
 *         applicableProducts:
 *           type: array
 *           items:
 *             type: string
 *           description: Specific products where coupon can be applied
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CouponCreate:
 *       type: object
 *       required:
 *         - code
 *         - discount
 *         - type
 *       properties:
 *         code:
 *           type: string
 *           description: Unique coupon code
 *         discount:
 *           type: number
 *           description: Discount amount or percentage
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Type of discount (percentage or fixed amount)
 *         description:
 *           type: string
 *           description: Coupon description
 *         minimumAmount:
 *           type: number
 *           description: Minimum order amount required to use coupon
 *         maximumDiscount:
 *           type: number
 *           description: Maximum discount amount allowed
 *         usageLimit:
 *           type: integer
 *           description: Maximum number of times coupon can be used
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Coupon start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Coupon end date
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the coupon is active
 *         applicableCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: Categories where coupon can be applied
 *         applicableProducts:
 *           type: array
 *           items:
 *             type: string
 *           description: Specific products where coupon can be applied
 *     CouponUpdate:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Unique coupon code
 *         discount:
 *           type: number
 *           description: Discount amount or percentage
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Type of discount (percentage or fixed amount)
 *         description:
 *           type: string
 *           description: Coupon description
 *         minimumAmount:
 *           type: number
 *           description: Minimum order amount required to use coupon
 *         maximumDiscount:
 *           type: number
 *           description: Maximum discount amount allowed
 *         usageLimit:
 *           type: integer
 *           description: Maximum number of times coupon can be used
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Coupon start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Coupon end date
 *         isActive:
 *           type: boolean
 *           description: Whether the coupon is active
 *         applicableCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: Categories where coupon can be applied
 *         applicableProducts:
 *           type: array
 *           items:
 *             type: string
 *           description: Specific products where coupon can be applied
 */

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management API
 */

router.use(authServices.protect, authServices.allowedTo("admin"));

/**
 * @swagger
 * /v1/api/coupons:
 *   get:
 *     summary: Get all coupons (Admin only)
 *     tags: [Coupons]
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
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [percentage, fixed]
 *         description: Filter by coupon type
 *     responses:
 *       200:
 *         description: Coupons retrieved successfully
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
 *                     $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CouponCreate'
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
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
router.route("/").post(createCouponValidator, createCoupon).get(getAllCoupons);

/**
 * @swagger
 * /v1/api/coupons/{id}:
 *   get:
 *     summary: Get a specific coupon by ID (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CouponUpdate'
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
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
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
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
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id")
  .get(getCouponValidator, getCoupons)
  .put(updateCouponValidator, UpdateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
