const express = require("express");
const authServices = require("../services/authServices/protect");

const {
  creatAddress,
  passingDataToReqBody,
  updateAddress,
  deleteAddress,
  createFilterObject,
  getAllAddress,
} = require("../services/user/userAddress/addressService");

const {
  checkLocationAvailable,
} = require("../services/user/userAddress/checkLocationAvaliable");

const {
  createAddressValidator,
  deleteAddressValidator,
  updateAddressValidator,
} = require("../utils/validators/addressValidator");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAddress:
 *       type: object
 *       required:
 *         - address
 *         - city
 *         - postalCode
 *         - country
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the address
 *         alias:
 *           type: string
 *           description: Address alias (e.g., Home, Work)
 *         details:
 *           type: string
 *           description: Detailed address information
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         city:
 *           type: string
 *           description: City name
 *         postalCode:
 *           type: string
 *           description: Postal/ZIP code
 *         country:
 *           type: string
 *           description: Country name
 *         user:
 *           type: string
 *           description: User ID who owns this address
 *         isDefault:
 *           type: boolean
 *           default: false
 *           description: Whether this is the default address
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserAddressCreate:
 *       type: object
 *       required:
 *         - alias
 *         - details
 *         - phone
 *         - city
 *         - postalCode
 *         - country
 *       properties:
 *         alias:
 *           type: string
 *           description: Address alias (e.g., Home, Work)
 *         details:
 *           type: string
 *           description: Detailed address information
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         city:
 *           type: string
 *           description: City name
 *         postalCode:
 *           type: string
 *           description: Postal/ZIP code
 *         country:
 *           type: string
 *           description: Country name
 *         isDefault:
 *           type: boolean
 *           default: false
 *           description: Whether this is the default address
 *     UserAddressUpdate:
 *       type: object
 *       properties:
 *         alias:
 *           type: string
 *           description: Address alias (e.g., Home, Work)
 *         details:
 *           type: string
 *           description: Detailed address information
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         city:
 *           type: string
 *           description: City name
 *         postalCode:
 *           type: string
 *           description: Postal/ZIP code
 *         country:
 *           type: string
 *           description: Country name
 *         isDefault:
 *           type: boolean
 *           description: Whether this is the default address
 *     LocationCheck:
 *       type: object
 *       required:
 *         - latitude
 *         - longitude
 *       properties:
 *         latitude:
 *           type: number
 *           description: Latitude coordinate
 *         longitude:
 *           type: number
 *           description: Longitude coordinate
 *     LocationCheckResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             isAvailable:
 *               type: boolean
 *               description: Whether the location is within delivery range
 *             message:
 *               type: string
 *               description: Availability message
 */

/**
 * @swagger
 * tags:
 *   name: UserAddresses
 *   description: User address management API
 */

/**
 * @swagger
 * /v1/api/userAddresses/isAvailable:
 *   post:
 *     summary: Check if a location is available for delivery
 *     tags: [UserAddresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationCheck'
 *     responses:
 *       200:
 *         description: Location availability checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationCheckResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/isAvailable").post(checkLocationAvailable);

router.use(authServices.protect);

/**
 * @swagger
 * /v1/api/userAddresses:
 *   get:
 *     summary: Get all addresses for the authenticated user
 *     tags: [UserAddresses]
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
 *         name: isDefault
 *         schema:
 *           type: boolean
 *         description: Filter by default address status
 *     responses:
 *       200:
 *         description: User addresses retrieved successfully
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
 *                     $ref: '#/components/schemas/UserAddress'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new address for the authenticated user
 *     tags: [UserAddresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAddressCreate'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserAddress'
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
  .get(createFilterObject, getAllAddress)
  .post(passingDataToReqBody, createAddressValidator, creatAddress);

/**
 * @swagger
 * /v1/api/userAddresses/{id}:
 *   put:
 *     summary: Update an existing address
 *     tags: [UserAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAddressUpdate'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserAddress'
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
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete an address
 *     tags: [UserAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
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
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id")
  .delete(deleteAddressValidator, deleteAddress)
  .put(passingDataToReqBody, updateAddressValidator, updateAddress);

module.exports = router;
