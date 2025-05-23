const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/customers/newCustomer', customerController.createCustomer);

// GET /customers/search?name=John
router.get('/customers/search', customerController.getCustomersByNameStart);
router.get('/customers/all', customerController.getAllCustomers);
module.exports = router;
