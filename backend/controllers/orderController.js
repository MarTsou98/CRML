const Order = require('../models/Order');
const mongoose = require('mongoose');
exports.createOrder = async (req, res) => {
    console.log('Received order payload:', req.body);
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
exports.getOrdersByCustomer = async (req, res) => {
  const { customerId } = req.params;

  try {
    const orders = await Order.find({ customer_id: customerId })
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for customer:', error);
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
exports.addPaymentToOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const { amount, method, payer, notes } = req.body;

  if (!amount || !method || !['Cash', 'Bank'].includes(method)) {
    return res.status(400).json({ error: 'Valid amount and method (Cash or Bank) are required' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const payment = {
      amount,
      method,
      payer,
      notes,
      date: new Date()
    };

    // Push payment to array
    order.moneyDetails.payments.push(payment);

    // Optionally update totalPaid
    order.moneyDetails.totalpaid = (order.moneyDetails.totalpaid || 0) + amount;

    await order.save();
    res.status(200).json({ message: 'Payment added', order });
  } catch (err) {
    console.error('Error adding payment:', err);
    res.status(500).json({ error: 'Server error adding payment' });
  }
};
exports.addDamageToOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const { amount, notes } = req.body;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Valid damage amount is required' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const damage = {
      amount,
      notes,
      date: new Date()
    };

    order.moneyDetails.damages.push(damage);

    // Optionally update totalDamages
    order.moneyDetails.totaldamages = (order.moneyDetails.totaldamages || 0) + amount;

    await order.save();
    res.status(200).json({ message: 'Damage added', order });
  } catch (err) {
    console.error('Error adding damage:', err);
    res.status(500).json({ error: 'Server error adding damage' });
  }
};



exports.searchOrders = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    return res.status(400).json({ message: 'Query parameter q is required' });
  }

  // If you want to search by _id only when q is a valid ObjectId
  const isValidObjectId = mongoose.Types.ObjectId.isValid(q);

  try {
    let filters = {};

    if (isValidObjectId) {
      filters._id = q; // only filter by _id if valid
    } else {
      // Otherwise, search by customer name or other fields (example with regex)
      filters = {
        $or: [
          { 'customer_id.firstName_normalized': new RegExp(q, 'i') },
          { 'customer_id.lastName_normalized': new RegExp(q, 'i') },
          { 'salesperson_id.name': new RegExp(q, 'i') },
          { 'contractor_id.name': new RegExp(q, 'i') },
          // add more fields if you want
        ]
      };
    }

    const orders = await Order.find(filters)
      .populate('customer_id', 'firstName lastName')
      .populate('salesperson_id', 'name')
      .populate('contractor_id', 'name');

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
