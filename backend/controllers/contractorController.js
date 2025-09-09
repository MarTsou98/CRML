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
      .populate({
        path: 'orders',
        populate: {
          path: 'customer_id',
          select: 'firstName lastName' // only send what you need
        }
      });

    if (!contractor) {
      return res.status(404).json({ error: 'Contractor not found' });
    }

    res.json(contractor);
  } catch (error) {
    console.error('Error fetching contractor:', error);
    res.status(500).json({ error: 'Server error fetching contractor' });
  }
};


exports.updateContractor = async (req, res) => {
  const { id } = req.params; // contractor ID
  const {
    EnterpriseName,
    VAT,
    Address,
    firstName,
    lastName,
    Role,
    salesperson_id,
    phone,
    email,
    ContractorNotes
  } = req.body;

  try {
    // Fetch existing contractor
    const contractor = await Contractor.findById(id);
    if (!contractor) {
      return res.status(404).json({ error: 'Contractor not found' });
    }

    // Optional: Validate required fields if you want to enforce them on update
    if (!EnterpriseName || !VAT || !Address) {
      return res.status(400).json({ error: 'EnterpriseName, VAT, and Address are required.' });
    }

    // Optional: If you want email uniqueness check, uncomment
    // if (email && email !== contractor.email) {
    //   const existing = await Contractor.findOne({ email });
    //   if (existing) return res.status(409).json({ error: 'Email already in use' });
    // }

    // Update fields
    contractor.EnterpriseName = EnterpriseName || contractor.EnterpriseName;
    contractor.VAT = VAT || contractor.VAT;
    contractor.Address = Address || contractor.Address;
    contractor.firstName = firstName ?? contractor.firstName;
    contractor.lastName = lastName ?? contractor.lastName;
    contractor.Role = Role ?? contractor.Role;
    contractor.salesperson_id = salesperson_id ?? contractor.salesperson_id;
    contractor.phone = phone ?? contractor.phone;
    contractor.email = email ?? contractor.email;
    contractor.ContractorNotes = ContractorNotes ?? contractor.ContractorNotes;

    // Save updates
    await contractor.save();

    // Populate references before sending back
    const populatedContractor = await Contractor.findById(id)
      .populate('salesperson_id')
      .populate('customers')
      .populate({
        path: 'orders',
        populate: { path: 'customer_id', select: 'firstName lastName' }
      });

    res.status(200).json(populatedContractor);
  } catch (error) {
    console.error('Error updating contractor:', error);
    res.status(500).json({ error: 'Server error updating contractor' });
  }
};