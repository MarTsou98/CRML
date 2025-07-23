// controllers/contractorController.js
const Contractor = require('../models/Contractor');
const logger = require('../utils/logger');
exports.createContractor = async (req, res) => {
  try {
    const {
      EnterpriseName,
      VAT,
      Address,
      firstName,
      lastName,
      Role,
      salesperson_id,
      ContractorNotes = '',
      email,
      phone
    } = req.body;

    // Validate required fields
    if (!EnterpriseName || !VAT || !Address) {
      return res.status(400).json({ error: 'EnterpriseName, VAT, and Address are required.' });
    }

    const contractor = new Contractor({
      EnterpriseName,
      VAT,
      Address,
      firstName,
      lastName,
      Role,
      salesperson_id,
      ContractorNotes,
      email,
      phone
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



exports.getAllContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find()
      .populate('salesperson_id')
      .populate('customers')
      .populate('orders');
    
    res.status(200).json(contractors);
  } catch (error) {
    console.error('Error fetching contractors:', error);
    res.status(500).json({ error: 'Server error fetching contractors' });
  }
};
// controllers/contractorController.js
exports.getContractorById = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id)
      .populate('salesperson_id')
      .populate('customers')
      .populate('orders');
    if (!contractor) return res.status(404).json({ error: 'Contractor not found' });
    res.json(contractor);
  } catch (error) {
    console.error('Error fetching contractor:', error);
    res.status(500).json({ error: 'Server error fetching contractor' });
  }
};