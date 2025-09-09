// models/Salesperson.js
const mongoose = require('mongoose');
const personSchema = require('./person');

const salespersonSchema = new mongoose.Schema({
  ...personSchema.obj,
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

module.exports = mongoose.model('Salesperson', salespersonSchema);
