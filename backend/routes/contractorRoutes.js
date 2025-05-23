// routes/contractorRoutes.js
const express = require('express');
const router = express.Router();
const contractorController = require('../controllers/contractorController');

// POST /contractors
router.post('/contractors', contractorController.createContractor);
router.get('/contractors/all', contractorController.getAllContractors);
module.exports = router;
