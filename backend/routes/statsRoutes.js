const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/orders-by-type', statsController.getOrdersByType);

router.get('/Type-Of-orders-by-salesperson/:salesperson_id', statsController.getTypeOfOrdersBySalesperson);
router.get('/Type-Of-orders-by-contractors/:contractor_id', statsController.getTypeOfOrdersByContractor);
router.get('/summary', statsController.getSummaryStats);
router.get('/salesperson/:id', statsController.getStatsForOneSalesperson);
router.get('/contractor/:id', statsController.getStatsForOneContractor);
router.get('/profit-by-salesperson', statsController.getProfitBySalesperson);
router.get('/profit-by-contractor', statsController.getProfitByContractor);
router.get('/type-of-orders-by-salesperson/name/:fullName', statsController.getTypeOfOrdersBySalespersonByName);
module.exports = router;
