// models/Manager.js
const mongoose = require('mongoose');
const salespersonSchema = require('./Salesperson').schema;

const managerSchema = new mongoose.Schema({
  ...salespersonSchema.obj,
    pseudoSalespersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salesperson',
  },
}, { timestamps: true });

module.exports = mongoose.model('Manager', managerSchema);
