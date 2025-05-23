const SalesPerson = require('../models/Salesperson');

exports.getAllSalesPeople = async (req, res) => {
  try {
    const salespeople = await SalesPerson.find();
    res.status(200).json(salespeople);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Server error fetching customers' });
  }
};