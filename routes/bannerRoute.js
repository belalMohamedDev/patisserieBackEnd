const express = require("express");
const {
  UpdateBanner,
  createBanner,
  deleteBanner,
  deleteImageBeforeUpdate,
  getAllbanner,
  uploadImageInCloud,
  resizeBannerImage,
  uploadBannerImage,
} = require("../services/bannerServices/bannerServices");
const authServices = require("../services/authServices/protect");

const {
  createBannerValidator,
  deleteBannerValidator,
  updateBannerValidator,
} = require("../utils/validators/bannerValidator");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - title
 *         - image
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the banner
 *         title:
 *           type: string
 *           description: Banner title
 *         description:
 *           type: string
 *           description: Banner description
 *         image:
 *           type: string
 *           description: Banner image URL
 *         link:
 *           type: string
 *           description: Banner link URL
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the banner is active
 *         position:
 *           type: integer
 *           description: Banner display position/order
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Banner start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Banner end date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BannerCreate:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Banner title
 *         description:
 *           type: string
 *           description: Banner description
 *         link:
 *           type: string
 *           description: Banner link URL
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the banner is active
 *         position:
 *           type: integer
 *           description: Banner display position/order
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Banner start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Banner end date
 *     BannerUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Banner title
 *         description:
 *           type: string
 *           description: Banner description
 *         link:
 *           type: string
 *           description: Banner link URL
 *         isActive:
 *           type: boolean
 *           description: Whether the banner is active
 *         position:
 *           type: integer
 *           description: Banner display position/order
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Banner start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Banner end date
 */

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management API
 */

/**
 * @swagger
 * /v1/api/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
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
 *         name: position
 *         schema:
 *           type: integer
 *         description: Filter by position
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
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
 *                     $ref: '#/components/schemas/Banner'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/").get(getAllbanner);

router.use(authServices.protect, authServices.allowedTo("admin"));

/**
 * @swagger
 * /v1/api/banners:
 *   post:
 *     summary: Create a new banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 description: Banner title
 *               description:
 *                 type: string
 *                 description: Banner description
 *               link:
 *                 type: string
 *                 description: Banner link URL
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the banner is active
 *               position:
 *                 type: integer
 *                 description: Banner display position/order
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Banner start date
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Banner end date
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Banner image file
 *     responses:
 *       201:
 *         description: Banner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
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
  .post(
    uploadBannerImage,
    resizeBannerImage,
    createBannerValidator,
    uploadImageInCloud,
    createBanner
  );

/**
 * @swagger
 * /v1/api/banners/{id}:
 *   put:
 *     summary: Update a banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Banner title
 *               description:
 *                 type: string
 *                 description: Banner description
 *               link:
 *                 type: string
 *                 description: Banner link URL
 *               isActive:
 *                 type: boolean
 *                 description: Whether the banner is active
 *               position:
 *                 type: integer
 *                 description: Banner display position/order
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Banner start date
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Banner end date
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Banner image file
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Banner'
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
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
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
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id")
  .put(
    uploadBannerImage,
    resizeBannerImage,
    updateBannerValidator,
    uploadImageInCloud,
    deleteImageBeforeUpdate,
    UpdateBanner
  )
  .delete(deleteBannerValidator, deleteBanner);

module.exports = router;
