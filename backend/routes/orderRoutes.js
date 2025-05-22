// routes/ordersRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // adjust path if needed

// GET /api/orders — fetch all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer_id')      // optional: populate related customers
      .populate('salesperson_id')   // optional: populate related salesperson
      .populate('contractor_id');   // optional: populate related contractor

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});
// GET /api/orders/:id — fetch one order by its ID
router.get('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Server error fetching order' });
  }
});

router.get('/orders/salesperson/:salespersonId', async (req, res) => {
  try {
    const salespersonId = req.params.salespersonId;

    const orders = await Order.find({ salesperson_id: salespersonId })
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for salesperson:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});
router.post('/orders/newOrder', async (req, res) => {
  try {
    // Get order data from request body
    const orderData = req.body;

    // Create a new Order instance
    const newOrder = new Order(orderData);

    // Save to DB (will trigger pre-save hooks)
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    // If it's a validation error, send 400, else 500
    if (error.name === 'ValidationError' || error.message.includes('Profit')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error creating order' });
  }
});







module.exports = router;
