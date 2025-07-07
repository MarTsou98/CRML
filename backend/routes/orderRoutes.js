const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
router.get('/search', orderController.searchOrders);
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/orders', orderController.getAllOrders);

/**
 * @swagger
 * /orders/salesperson/{salespersonId}:
 *   get:
 *     summary: Get all orders from a specific salesperson by their ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: salespersonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Salesperson ID
 *     responses:
 *       200:
 *         description: List of orders for the salesperson
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid salesperson ID
 *       500:
 *         description: Server error
 */
router.get('/orders/salesperson/:salespersonId', orderController.getOrdersBySalesperson);

/**
 * @swagger
 * /orders/contractor/{contractorId}:
 *   get:
 *     summary: Get all orders from a specific contractor by their ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: contractorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contractor ID
 *     responses:
 *       200:
 *         description: List of orders for the contractor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid contractor ID
 *       500:
 *         description: Server error
 */
router.get('/orders/contractor/:contractorId', orderController.getOrdersByContractor);

/**
 * @swagger
 * /orders/customer/{customerId}:
 *   get:
 *     summary: Get all orders from a specific customer by their ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: List of orders for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid customer ID
 *       500:
 *         description: Server error
 */
router.get('/orders/customer/:customerId', orderController.getOrdersByCustomer);

/**
 * @swagger
 * /orders/newOrder:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       description: Order data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/orders/newOrder', orderController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order ID
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/orders/:id', orderController.getOrderById);

/**
 * @swagger
 * /orders/{orderId}/addpayment:
 *   post:
 *     summary: Add a payment to an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       description: Payment details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *                 enum: [Cash, Bank]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.post('/orders/:orderId/addpayment', orderController.addPaymentToOrder);

/**
 * @swagger
 * /orders/{orderId}/adddamage:
 *   post:
 *     summary: Add damage details to an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       description: Damage details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Damage added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.post('/orders/:orderId/adddamage', orderController.addDamageToOrder);

module.exports = router;
