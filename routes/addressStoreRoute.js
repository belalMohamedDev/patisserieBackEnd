const express = require("express");
const authServices = require("../services/authServices/protect");
const {
  UpdatestoreAddress,
  createstoreAddress,
  deletestoreAddress,
  getAllstoreAddresss,
  passingDataToReqBody,
  getRegions,
} = require("../services/adminServices/addressStore/storeAddress");

const {
  createStoreAddressValidator,
  updateBranchAddressValidator,
  deleteBranchAddressValidator,
} = require("../utils/validators/storeAddressValidator");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreAddress:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - city
 *         - region
 *         - country
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the store address
 *         name:
 *           type: string
 *           description: Store/branch name
 *         address:
 *           type: string
 *           description: Store address details
 *         city:
 *           type: string
 *           description: City name
 *         region:
 *           type: string
 *           description: Region/state name
 *         country:
 *           type: string
 *           description: Country name
 *         postalCode:
 *           type: string
 *           description: Postal/ZIP code
 *         phone:
 *           type: string
 *           description: Store contact phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Store contact email
 *         workingHours:
 *           type: object
 *           description: Store working hours
 *           properties:
 *             open:
 *               type: string
 *               description: Opening time
 *             close:
 *               type: string
 *               description: Closing time
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the store is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     StoreAddressCreate:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - city
 *         - region
 *         - country
 *       properties:
 *         name:
 *           type: string
 *           description: Store/branch name
 *         address:
 *           type: string
 *           description: Store address details
 *         city:
 *           type: string
 *           description: City name
 *         region:
 *           type: string
 *           description: Region/state name
 *         country:
 *           type: string
 *           description: Country name
 *         postalCode:
 *           type: string
 *           description: Postal/ZIP code
 *         phone:
 *           type: string
 *           description: Store contact phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Store contact email
 *         workingHours:
 *           type: object
 *           description: Store working hours
 *           properties:
 *             open:
 *               type: string
 *               description: Opening time
 *             close:
 *               type: string
 *               description: Closing time
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the store is active
 *     StoreAddressUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Store/branch name
 *         address:
 *           type: string
 *           description: Store address details
 *         city:
 *           type: string
 *           description: City name
 *         region:
 *           type: string
 *           description: Region/state name
 *         country:
 *           type: string
 *           description: Country name
 *         postalCode:
 *           type: string
 *           description: Postal/ZIP code
 *         phone:
 *           type: string
 *           description: Store contact phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Store contact email
 *         workingHours:
 *           type: object
 *           description: Store working hours
 *           properties:
 *             open:
 *               type: string
 *               description: Opening time
 *             close:
 *               type: string
 *               description: Closing time
 *         isActive:
 *           type: boolean
 *           description: Whether the store is active
 *     Region:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Region ID
 *         name:
 *           type: string
 *           description: Region name
 *         country:
 *           type: string
 *           description: Country name
 */

/**
 * @swagger
 * tags:
 *   name: StoreAddresses
 *   description: Store address management API
 */

/**
 * @swagger
 * /v1/api/addressStores:
 *   get:
 *     summary: Get all store addresses
 *     tags: [StoreAddresses]
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
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by region
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Store addresses retrieved successfully
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
 *                     $ref: '#/components/schemas/StoreAddress'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/").get(getAllstoreAddresss);

/**
 * @swagger
 * /v1/api/addressStores/regions:
 *   get:
 *     summary: Get all available regions
 *     tags: [StoreAddresses]
 *     responses:
 *       200:
 *         description: Regions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Region'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route("/regions").get(getRegions);

router.use(authServices.protect, authServices.allowedTo("admin"));

/**
 * @swagger
 * /v1/api/addressStores:
 *   post:
 *     summary: Create a new store address (Admin only)
 *     tags: [StoreAddresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreAddressCreate'
 *     responses:
 *       201:
 *         description: Store address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/StoreAddress'
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
  .post(createStoreAddressValidator, passingDataToReqBody, createstoreAddress);

/**
 * @swagger
 * /v1/api/addressStores/{id}:
 *   put:
 *     summary: Update a store address (Admin only)
 *     tags: [StoreAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreAddressUpdate'
 *     responses:
 *       200:
 *         description: Store address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/StoreAddress'
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
 *         description: Store address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a store address (Admin only)
 *     tags: [StoreAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store address ID
 *     responses:
 *       200:
 *         description: Store address deleted successfully
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
 *         description: Store address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id")
  .put(updateBranchAddressValidator, passingDataToReqBody, UpdatestoreAddress);

router.route("/:id").delete(deleteBranchAddressValidator, deletestoreAddress);

module.exports = router;
