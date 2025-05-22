const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// POST /api/customers — create a new customer
router.post('/customers', async (req, res) => {
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

    // Optional: check for required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'firstName, lastName, and email are required' });
    }

    // Check for duplicate email (since it's unique)
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
});

module.exports = router;
