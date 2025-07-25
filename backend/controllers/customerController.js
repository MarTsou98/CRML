const Customer = require('../models/Customer');
const normalizeGreek = require('../utils/normalizeGreek');
const logger = require('../utils/logger');
exports.createCustomer = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      phone,
      address,
      id_of_salesperson,
      id_of_contractor,
       CustomerNotes // ✅ Include this in the destructuring
    } = req.body;
if(id_of_contractor === 'undefined' || id_of_contractor === ''|| id_of_contractor === null) {id_of_contractor = '6836d07cf73e4ebd95b75b2b';}
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
       CustomerNotes, // ✅ Now included in the document
      id_of_salesperson, // ✅ Fix this field name
 id_of_contractor     // ✅ And this one too
    });

    await customer.save();

    res.status(201).json({ message: 'Customer created', customer });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
/*exports.getCustomersByNameStart = async (req, res) => {
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
};*/
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('id_of_salesperson id_of_contractor');
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Server error fetching customers' });
  }
};
exports.getCustomersBySalespersonId = async (req, res) => {
  const { salespersonId } = req.params;

  if (!salespersonId) {
    return res.status(400).json({ error: 'Missing salesperson ID' });
  }

  try {
    const customers = await Customer.find({ id_of_salesperson: salespersonId })
      .populate('id_of_salesperson id_of_contractor');

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers by salesperson ID:', error);
    res.status(500).json({ error: 'Server error fetching customers by salesperson ID' });
  }
}
exports.getCustomersDetailsByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).json({ error: 'Missing customer ID' });
  }

  try {
    const customer = await Customer.findById(customerId)
      .populate('id_of_salesperson id_of_contractor')
      .populate({
        path: 'orders',
        populate: {
          path: 'customer_id',
          select: 'firstName lastName'
        }
      });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ error: 'Server error fetching customer details' });
  }
};
exports.getCustomersByQuery = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter "query"' });

  const normalized = normalizeGreek(query);

  try {
    const customers = await Customer.find({
      $or: [
        { firstName_normalized: { $regex: normalized, $options: 'i' } },
        { lastName_normalized: { $regex: normalized, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    })
    .populate({
      path: 'id_of_salesperson',
      select: 'name email phone' // Adjust as needed
    })
    .populate({
      path: 'id_of_contractor',
      select: 'companyName contactName' // Adjust as needed
    });

    res.json(customers);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error during search' });
  }
};





function removeTonos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}