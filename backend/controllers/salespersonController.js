const SalesPerson = require('../models/Salesperson');
const logger = require('../utils/logger');
exports.getAllSalesPeople = async (req, res) => {
  try {
    const salespeople = await SalesPerson.find();
    res.status(200).json(salespeople);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Server error fetching customers' });
  }
};
exports.getSalespersonById = async (req, res) => {
  try {
    const salesperson = await Salesperson.findById(req.params.id)
      .populate('customers')
      .populate({
        path: 'orders',
        populate: {
          path: 'customer_id contractor_id salesperson_id', // if you want nested info inside orders
          select: 'firstName lastName' // optional, adjust fields you want
        }
      });

    if (!salesperson) {
      return res.status(404).json({ message: 'Salesperson not found' });
    }

    res.json(salesperson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};