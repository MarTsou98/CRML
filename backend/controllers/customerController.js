const Customer = require('../models/Customer');
const normalizeGreek = require('../utils/normalizeGreek');

exports.createCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      id_of_salesperson,
      id_of_contractor
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'firstName, lastName, and email are required' });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const customer = new Customer({
      firstName,
      lastName,
      email,
      phone,
      address,
      id_of_salesperson,
      id_of_contractor
    });

    await customer.save();

    res.status(201).json({ message: 'Customer created', customer });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getCustomersByNameStart = async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing query parameter "name"' });

  const normalized = normalizeGreek(name);

  try {
    const customers = await Customer.find({
      $or: [
        { firstName_normalized: { $regex: `^${normalized}`, $options: 'i' } },
        { lastName_normalized: { $regex: `^${normalized}`, $options: 'i' } }
      ]
    }).select('_id firstName lastName');

    res.json(customers);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error during search' });
  }
};
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('id_of_salesperson id_of_contractor');
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Server error fetching customers' });
  }
};





function removeTonos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}