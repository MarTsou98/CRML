const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Search orders
router.get('/search', orderController.searchOrders);

// All orders
router.get('/orders', orderController.getAllOrders);

// Orders by salesperson
router.get('/orders/salesperson/:salespersonId', orderController.getOrdersBySalesperson);

// Orders by contractor
router.get('/orders/contractor/:contractorId', orderController.getOrdersByContractor);

// Orders by customer
router.get('/orders/customer/:customerId', orderController.getOrdersByCustomer);

// Create new order
router.post('/orders/newOrder', orderController.createOrder);

// Get order by ID
router.get('/orders/:id', orderController.getOrderById);

// Update full order (original logic)
router.patch('/orders/:id', orderController.updateOrder);

// Update only general info (new endpoint)
router.patch('/orders/:id/general-info', orderController.updateOrderGeneralInfo);

// Add payment to order
router.post('/orders/:orderId/addpayment', orderController.addPaymentToOrder);

// Add damage to order
router.post('/orders/:orderId/adddamage', orderController.addDamageToOrder);

module.exports = router;
