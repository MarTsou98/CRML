// routes/contractorRoutes.js
const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractorController');

// POST /contractors
router.post('/contractors', contractController.createContractor);

module.exports = router;
