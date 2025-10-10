const express = require("express");
const authServices = require("../services/authServices/protect");
const { addProductToCart } = require("../services/cartServices/cartServices");

const {
  getLoggedUserCart,
} = require("../services/cartServices/getLoggedUserCart");
const {
  removeSpecificCartItem,
} = require("../services/cartServices/removeCartItem");
const {
  clearLoggedUserCartItem,
} = require("../services/cartServices/clearLoggedUserCartItem");
const {
  updateSpecificCartItemQuantity,
} = require("../services/cartServices/updateSpecificCartItemQuantity");
const {
  applyCouponOnLoggedUserCart,
} = require("../services/cartServices/applyCouponOnLoggedUserCart");

const { cardSetting } = require("../services/cartServices/cartSetting");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the cart item
 *         product:
 *           type: string
 *           description: Product ID
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of the product
 *         price:
 *           type: number
 *           description: Price per unit
 *         color:
 *           type: string
 *           description: Product color (if applicable)
 *         totalPrice:
 *           type: number
 *           description: Total price for this item
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the cart
 *         user:
 *           type: string
 *           description: User ID who owns the cart
 *         cartItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalCartPrice:
 *           type: number
 *           description: Total price of all items in cart
 *         totalPriceAfterDiscount:
 *           type: number
 *           description: Total price after applying discount
 *         coupon:
 *           type: string
 *           description: Applied coupon ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AddToCart:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: Product ID to add to cart
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity to add
 *         color:
 *           type: string
 *           description: Product color (optional)
 *     UpdateCartItem:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: New quantity
 *     ApplyCoupon:
 *       type: object
 *       required:
 *         - couponName
 *       properties:
 *         couponName:
 *           type: string
 *           description: Coupon code to apply
 *     CartSettings:
 *       type: object
 *       properties:
 *         taxPercent:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Tax percentage
 *         shippingPrice:
 *           type: number
 *           minimum: 0
 *           description: Shipping price
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management API
 */

router.use(authServices.protect, authServices.allowedTo("user"));

/**
 * @swagger
 * /v1/api/cart/clearAllItems:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
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
 */
router.route("/clearAllItems").delete(clearLoggedUserCartItem);

/**
 * @swagger
 * /v1/api/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCart'
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
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
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/").post(authServices.allowedTo("user", "admin"),addProductToCart).get(getLoggedUserCart);

/**
 * @swagger
 * /v1/api/cart/applyCoupon:
 *   put:
 *     summary: Apply coupon to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplyCoupon'
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request or invalid coupon
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
router.route("/applyCoupon").put(applyCouponOnLoggedUserCart);

/**
 * @swagger
 * /v1/api/cart/{itemId}:
 *   delete:
 *     summary: Remove specific item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItem'
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
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
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateSpecificCartItemQuantity);

/**
 * @swagger
 * /v1/api/cart/updateTaxAndShipping:
 *   put:
 *     summary: Update cart tax and shipping settings (Admin only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartSettings'
 *     responses:
 *       200:
 *         description: Cart settings updated successfully
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
 */
router
  .route("/updateTaxAndShipping")
  .put(authServices.protect, authServices.allowedTo("admin"), cardSetting);

module.exports = router;
