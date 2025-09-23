const Order = require('../models/Order');
const mongoose = require('mongoose');

const logger = require('../utils/logger');
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Validate profit
    //if (orderData.moneyDetails.profit < 0) {
      //return res.status(400).json({ error: 'Profit cannot be negative' });
   // }
if (orderData.DateOfOrder) {
  const date = new Date(orderData.DateOfOrder);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: 'Invalid DateOfOrder' });
  }
  date.setHours(0, 0, 0, 0); // strip time
  orderData.DateOfOrder = date;
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

  const { amount, method, payer, notes, DateOfPayment } = req.body;

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
      DateOfPayment: DateOfPayment ? new Date(DateOfPayment) : new Date() // fallback if not provided
    };

    order.moneyDetails.payments.push(payment);

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
  const { amount, notes, typeOfDamage, DateOfDamages } = req.body;

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
      DateOfDamages: DateOfDamages ? new Date(DateOfDamages) : new Date()
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $push: { 'moneyDetails.damages': damage } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Damage added', order: updatedOrder });
  } catch (err) {
    console.error('Error adding damage:', err);
    res.status(500).json({ error: 'Server error adding damage' });
  }
};

exports.updateDamage = async (req, res) => {
  const { orderId, damageId } = req.params;
  const { amount, typeOfDamage, notes, DateOfDamages } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(damageId)) {
    return res.status(400).json({ error: 'Invalid order or damage ID' });
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, 'moneyDetails.damages._id': damageId },
      {
        $set: {
          'moneyDetails.damages.$.amount': amount,
          'moneyDetails.damages.$.typeOfDamage': typeOfDamage,
          'moneyDetails.damages.$.notes': notes,
          'moneyDetails.damages.$.DateOfDamages': DateOfDamages ? new Date(DateOfDamages) : new Date(),
        },
      },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: 'Order or damage not found' });

    // Recalculate total damages
    const totaldamages = updatedOrder.moneyDetails.damages.reduce((sum, d) => sum + (d.amount || 0), 0);
    updatedOrder.moneyDetails.totaldamages = totaldamages;
    await updatedOrder.save();

    res.status(200).json({ message: 'Damage updated successfully', order: updatedOrder });
  } catch (err) {
    console.error('Error updating damage:', err);
    res.status(500).json({ error: 'Server error updating damage' });
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
    // Validate moneyDetails
    if (updates.moneyDetails) {
      const { profit, timi_Timokatalogou, timi_Polisis } = updates.moneyDetails;

      // Profit validation
    //  if (typeof profit === 'number' && profit < 0) {
     //   return res.status(400).json({ error: 'Profit cannot be negative' });
     // }

      // Proforma < Sale Price validation
     // if (
      //  typeof timi_Timokatalogou === 'number' &&
      //  typeof timi_Polisis === 'number' &&
      //  timi_Timokatalogou >= timi_Polisis
   //   ) {
       // return res.status(400).json({ error: 'Proforma must be less than Sale Price' });
     // }
    }

    // DateOfOrder parsing
    if (updates.DateOfOrder) {
      const date = new Date(updates.DateOfOrder);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Invalid DateOfOrder' });
      }
      date.setHours(0, 0, 0, 0);
      updates.DateOfOrder = date;
    }

    // Fetch the order first (so we can trigger recalculations)
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Merge updates into the order object
    Object.assign(order, updates);

    // Recalculate profit
   // if (order.moneyDetails.timi_Timokatalogou != null && order.moneyDetails.timi_Polisis != null) {
     // order.moneyDetails.profit = order.moneyDetails.timi_Polisis - order.moneyDetails.timi_Timokatalogou;
     // if (order.moneyDetails.profit < 0) {
     //   return res.status(400).json({ error: 'Profit cannot be negative' });
     // }
    //}

    // Recalculate FPA (tax)
    if (order.moneyDetails.bank != null) {
      const bankAmount = order.moneyDetails.bank;
      order.moneyDetails.FPA = bankAmount - bankAmount / 1.24; // assuming 24% tax
    }

    // Save the order (triggers pre-save hooks for remaining shares, damages, payments, etc.)
    await order.save();

    // Populate references before sending response
    await order.populate('customer_id salesperson_id contractor_id');

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error updating order' });
  }
};

exports.updateOrderGeneralInfo = async (req, res) => {
  const { id } = req.params;
  const { invoiceType, Lock, orderNotes, orderType, DateOfOrder, orderedFromCompany } = req.body;

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
    const allowedCompanies = ['Lube', 'Decopan', 'Sovet', 'Doors', 'Appliances', 'CounterTop'];

    if (invoiceType && !allowedInvoiceTypes.includes(invoiceType)) {
      return res.status(400).json({ error: 'Invalid invoiceType' });
    }

    if (orderType && !allowedOrderTypes.includes(orderType)) {
      return res.status(400).json({ error: 'Invalid orderType' });
    }

    if (orderedFromCompany && !allowedCompanies.includes(orderedFromCompany)) {
      return res.status(400).json({ error: 'Invalid orderedFromCompany' });
    }

    // Apply updates
    if (typeof invoiceType === 'string') order.invoiceType = invoiceType;
    if (typeof Lock === 'boolean') order.Lock = Lock;
    if (typeof orderNotes === 'string') order.orderNotes = orderNotes;
    if (typeof orderType === 'string') order.orderType = orderType;
    if (typeof orderedFromCompany === 'string') order.orderedFromCompany = orderedFromCompany;

    if (DateOfOrder) {
      const parsedDate = new Date(DateOfOrder);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid DateOfOrder' });
      }
      order.DateOfOrder = parsedDate;
    }

    await order.save();

    res.status(200).json({ message: 'Order general info updated', order });
  } catch (err) {
    console.error('Error updating general info:', err);
    res.status(500).json({ error: 'Failed to update general order info' });
  }
};



exports.updatePayment = async (req, res) => {
  const { orderId, paymentId } = req.params;
  const { amount, method, payer, notes, DateOfPayment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(paymentId)) {
    return res.status(400).json({ error: 'Invalid order or payment ID' });
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, 'moneyDetails.payments._id': paymentId },
      {
        $set: {
          'moneyDetails.payments.$.amount': amount,
          'moneyDetails.payments.$.method': method,
          'moneyDetails.payments.$.payer': payer,
          'moneyDetails.payments.$.notes': notes,
          'moneyDetails.payments.$.DateOfPayment': DateOfPayment ? new Date(DateOfPayment) : new Date(),
        },
      },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: 'Order or payment not found' });

    // Optionally, recalculate totalpaid
    const totalpaid = updatedOrder.moneyDetails.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    updatedOrder.moneyDetails.totalpaid = totalpaid;
    await updatedOrder.save();

    res.status(200).json({ message: 'Payment updated successfully', order: updatedOrder });
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ error: 'Server error updating payment' });
  }
};


exports.updateShares = async (req, res) => {
  const { orderId } = req.params;
  const { contractor_Share_Cash, contractor_Share_Bank, customer_Share_Cash, customer_Share_Bank } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (contractor_Share_Cash !== undefined) order.moneyDetails.contractor_Share_Cash = contractor_Share_Cash;
    if (contractor_Share_Bank !== undefined) order.moneyDetails.contractor_Share_Bank = contractor_Share_Bank;
    if (customer_Share_Cash !== undefined) order.moneyDetails.customer_Share_Cash = customer_Share_Cash;
    if (customer_Share_Bank !== undefined) order.moneyDetails.customer_Share_Bank = customer_Share_Bank;

    await order.save(); // remaining shares are recalculated automatically
    res.status(200).json({ message: 'Shares updated', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shares' });
  }
};

exports.getOrdersByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Normalize start/end to full-day boundaries
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      DateOfOrder: { $gte: startDate, $lte: endDate }
    })
      .populate('customer_id')
      .populate('salesperson_id')
      .populate('contractor_id');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by date range:', error);
    res.status(500).json({ error: 'Server error fetching orders by date range' });
  }
};

/*
exports.getStats = async (req, res) => {
  try {
    const { start, end, groupBy } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const allowedGroups = ['salesperson_id', 'contractor_id', 'orderedFromCompany'];
    if (!groupBy || !allowedGroups.includes(groupBy)) {
      return res.status(400).json({ error: `Invalid groupBy. Must be one of: ${allowedGroups.join(', ')}` });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Aggregate orders
    let stats = await Order.aggregate([
      { $match: { DateOfOrder: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: `$${groupBy}`,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$moneyDetails.timi_Polisis" },
          totalProfit: { $sum: "$moneyDetails.profit" },
          orders: { $push: "$$ROOT" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Populate references for each order in every group
    for (const group of stats) {
      group.orders = await Order.populate(group.orders, [
        { path: 'customer_id', select: 'firstName lastName' },
        { path: 'salesperson_id', select: 'name' },
        { path: 'contractor_id', select: 'name' }
      ]);
      
      // Optionally, add a name for the group itself if grouping by ObjectId
      if (groupBy === 'salesperson_id' || groupBy === 'contractor_id') {
        const Model = groupBy === 'salesperson_id'
          ? mongoose.model('Salesperson')
          : mongoose.model('Contractor');
        const doc = await Model.findById(group._id).lean();
        group.name = doc ? doc.name : 'Unknown';
      }
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};*/

exports.getStats = async (req, res) => {
  try {
    const { start, end, groupBy } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const allowedGroups = ['salesperson_id', 'contractor_id', 'orderedFromCompany'];
    if (!groupBy || !allowedGroups.includes(groupBy)) {
      return res.status(400).json({ error: `Invalid groupBy. Must be one of: ${allowedGroups.join(', ')}` });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch all orders in the date range
    let orders = await Order.find({
      DateOfOrder: { $gte: startDate, $lte: endDate }
    })
    .populate('customer_id', 'firstName lastName')
    .populate('salesperson_id', 'firstName lastName')
    .populate('contractor_id', 'name')
    .lean(); // optional: returns plain JS objects

    // Optional: you could sort orders by group or date
    orders.sort((a, b) => new Date(a.DateOfOrder) - new Date(b.DateOfOrder));

    res.json(orders);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};



