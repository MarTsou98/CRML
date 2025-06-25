const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const SalesPerson = require('../models/Salesperson');
const salespersonController = require('../controllers/salespersonController');

router.get('/salespeople/all', salespersonController.getAllSalesPeople);
router.get('/salesperson/:id', salespersonController.getSalespersonById);
module.exports = router;