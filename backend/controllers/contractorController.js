// controllers/contractorController.js
const Contractor = require('../models/Contractor');

exports.createContractor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      Role,
      salesperson_id,
      customers,
      orders
    } = req.body;

    const contractor = new Contractor({
      firstName,
      lastName,
      Role,
      salesperson_id,
      customers,
      orders
    });

    await contractor.save();

    res.status(201).json({
      message: 'Contractor created successfully',
      contractor
    });
  } catch (error) {
    console.error('Error creating contractor:', error);
    res.status(500).json({ error: 'Server error while creating contractor' });
  }
};
