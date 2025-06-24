const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/orders-by-type', statsController.getOrdersByType);
router.get('/summary', statsController.getSummaryStats);
router.get('/salesperson/:id', statsController.getStatsForOneSalesperson);
router.get('/contractor/:id', statsController.getStatsForOneContractor);
module.exports = router;
