const Order = require('../models/Order');
const mongoose = require('mongoose');

const logger = require('../utils/logger');
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    if (orderData.moneyDetails.profit < 0) {
      return res.status(400).json({ error: 'Profit cannot be negative' });
    }

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    logger.info('Order created successfully', {
      order: savedOrder.toObject()
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    logger.error('Error creating order', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error creating order' });
  }
};


exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn('Invalid order ID requested', { id, route: req.originalUrl });
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(id)
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');

    if (!order) {
      logger.info('Order not found', { id });
      return res.status(404).json({ error: 'Order not found' });
    }

    logger.info('Order fetched successfully', {
      orderId: id,
      user: order.salesperson_id, // assuming user is attached via auth middleware
      route: req.originalUrl
    });

    res.json(order);
  } catch (error) {
    logger.error('Error fetching order by ID', {
      id,
      error: error.message,
      stack: error.stack
    });
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
  const { amount, notes, typeOfDamage } = req.body;

  const allowedTypes = [
    'Μεταφορά εξωτερικού',
    'Μεταφορά εσωτερικού',
    'Τοποθέτηση',
    'Διάφορα'
  ];

  if (!amount || typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ error: 'Valid damage amount is required' });
  }

  if (!typeOfDamage || !allowedTypes.includes(typeOfDamage)) {
    return res.status(400).json({ error: 'Invalid or missing typeOfDamage' });
  }

  try {
    const damage = {
      amount,
      notes,
      typeOfDamage,
      date: new Date()
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $push: { 'moneyDetails.damages': damage }
      },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json({ message: 'Damage added', order: updatedOrder });
  } catch (err) {
    console.error('Error adding damage:', err);
    res.status(500).json({ error: 'Server error adding damage' });
  }
};






exports.searchOrders = async (req, res) => {

 
  const { q } = req.query;
   console.log("Received query:", q);
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
    isValidObjectId ? { _id: q } : null,
    { 'customer_id.firstName_normalized': new RegExp(q, 'i') },
    { 'customer_id.lastName_normalized': new RegExp(q, 'i') },
    { 'salesperson_id.name': new RegExp(q, 'i') },
    { 'contractor_id.name': new RegExp(q, 'i') },
  ].filter(Boolean) // remove null if q isn't ObjectId
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
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    // Optional: Validate profit if present in updates.moneyDetails
    if (updates.moneyDetails && typeof updates.moneyDetails.profit !== 'undefined' && updates.moneyDetails.profit < 0) {
      return res.status(400).json({ error: 'Profit cannot be negative' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await updatedOrder.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error updating order' });
  }
};
exports.updateOrderGeneralInfo = async (req, res) => {
  const { id } = req.params;
  const { invoiceType, Lock, orderNotes, orderType } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const allowedInvoiceTypes = ['Timologio', 'Apodiksi'];
    const allowedOrderTypes = ['Κανονική', 'Σύνθεση Ερμαρίων'];

    if (invoiceType && !allowedInvoiceTypes.includes(invoiceType)) {
      return res.status(400).json({ error: 'Invalid invoiceType' });
    }

    if (orderType && !allowedOrderTypes.includes(orderType)) {
      return res.status(400).json({ error: 'Invalid orderType' });
    }

    if (typeof invoiceType === 'string') order.invoiceType = invoiceType;
    if (typeof Lock === 'boolean') order.Lock = Lock;
    if (typeof orderNotes === 'string') order.orderNotes = orderNotes;
    if (typeof orderType === 'string') order.orderType = orderType;  // <-- fixed here

    await order.save();

    res.status(200).json({ message: 'Order general info updated', order });
  } catch (err) {
    console.error('Error updating general info:', err);
    res.status(500).json({ error: 'Failed to update general order info' });
  }
};
