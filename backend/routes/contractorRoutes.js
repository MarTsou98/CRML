// routes/contractorRoutes.js
const express = require('express');
const router = express.Router();
const contractorController = require('../controllers/contractorController');

// POST /contractors
router.post('/createContractor', contractorController.createContractor);
router.get('/contractors/all', contractorController.getAllContractors);
// routes/contractorRoutes.js
router.get('/contractors/:id', contractorController.getContractorById);

module.exports = router;
