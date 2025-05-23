const Order = require('../models/Order');
const mongoose = require('mongoose');
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // ✅ Business logic (you can move more here)
    if (orderData.moneyDetails.profit < 0) {
      return res.status(400).json({ error: 'Profit cannot be negative' });
    }

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save(); // This triggers pre-save hooks

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);

    if (error.name === 'ValidationError' || error.message.includes('Profit')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Server error creating order' });
  }
};
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  // ✅ Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(id)
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
};
exports.getOrdersBySalesperson = async (req, res) => {
  const { salespersonId } = req.params;

  try {
    const orders = await Order.find({ salesperson_id: salespersonId })
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for salesperson:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};
exports.getOrdersByContractor = async (req, res) => {
  const { contractorId } = req.params;

  try {
    const orders = await Order.find({ contractor_id: contractorId })
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for contractor:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};