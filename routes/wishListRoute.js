const express = require("express");
const {
  addOrRemoveProductInWishList,
  getAllProductFromWishList,
  removeProductFromWishList,
} = require("../services/wishListServices/wishList");
const authServices = require("../services/authServices/protect");

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * components:
 *   schemas:
 *     WishListItem:
 *       type: object
 *       required:
 *         - user
 *         - product
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the wishlist item
 *         user:
 *           type: string
 *           description: User ID who owns this wishlist item
 *         product:
 *           type: object
 *           description: Product information
 *           properties:
 *             _id:
 *               type: string
 *               description: Product ID
 *             name:
 *               type: string
 *               description: Product name
 *             price:
 *               type: number
 *               description: Product price
 *             image:
 *               type: string
 *               description: Product image URL
 *             description:
 *               type: string
 *               description: Product description
 *             category:
 *               type: string
 *               description: Product category
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     WishListAdd:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         productId:
 *           type: string
 *           description: Product ID to add to wishlist
 *     WishListRemove:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         productId:
 *           type: string
 *           description: Product ID to remove from wishlist
 */

/**
 * @swagger
 * tags:
 *   name: WishList
 *   description: User wishlist management API
 */

router.use(authServices.protect, authServices.allowedTo("user"));

/**
 * @swagger
 * /v1/api/wishList:
 *   get:
 *     summary: Get all products in user's wishlist
 *     tags: [WishList]
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
 *         description: Wishlist items retrieved successfully
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
 *                     $ref: '#/components/schemas/WishListItem'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Add or remove a product from wishlist
 *     tags: [WishList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WishListAdd'
 *     responses:
 *       200:
 *         description: Product added/removed from wishlist successfully
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
 *                   description: Success message indicating add or remove action
 *                 data:
 *                   $ref: '#/components/schemas/WishListItem'
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
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Remove a product from wishlist
 *     tags: [WishList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WishListRemove'
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
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
 *         description: Product not found in wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/")
  .post(addOrRemoveProductInWishList)
  .get(getAllProductFromWishList)
  .delete(removeProductFromWishList);

module.exports = router;
