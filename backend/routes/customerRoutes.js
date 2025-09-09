const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/customers/newCustomer', customerController.createCustomer);


// GET /customers/search?name=John
//router.get('/customers/search', customerController.getCustomersByNameStart);
router.get('/customers/search', customerController.getCustomersByQuery);
router.get('/customers/all', customerController.getAllCustomers);
router.get('/customers/salesperson/:salespersonId', customerController.getCustomersBySalespersonId);
router.get('/customers/:customerId', customerController.getCustomersDetailsByCustomerId);
//router.get('/customers/search', customerController.getCustomersByQuery);
// PATCH /customers/:customerId
router.patch('/customers/:customerId', customerController.updateCustomer);

module.exports = router;
