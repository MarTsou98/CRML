const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const SalesPerson = require('../models/Salesperson');
const salespersonController = require('../controllers/salespersonController');

router.get('/salespeople/all', salespersonController.getAllSalesPeople);

module.exports = router;