// routes/orderRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const orderController = require('../controllers/orderController');
// 🔹 GET all orders
router.get('/orders', orderController.getAllOrders);

// 🔹 GET orders by salesperson
router.get('/orders/salesperson/:salespersonId', orderController.getOrdersBySalesperson);
// 🔹 GET orders by Contractor
router.get('/orders/contractor/:contractorId', orderController.getOrdersByContractor);
router.get('/orders/customer/:customerId', orderController.getOrdersByCustomer);
// 🔹 POST: Create a new order
router.post('/orders/newOrder', orderController.createOrder);

// 🔹 GET one order by ID (must come LAST)
router.get('/orders/:id', orderController.getOrderById);

router.post('/orders/:orderId/addpayment', orderController.addPaymentToOrder);
router.post('/orders/:orderId/adddamage', orderController.addDamageToOrder);

module.exports = router;
