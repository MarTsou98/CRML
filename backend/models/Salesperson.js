const mongoose = require('mongoose');

const salespersonSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  Role: {
    type: String
  },
  customers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }
],

orders: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
]}, { timestamps: true }); // Adds createdAt and updatedAt
 

module.exports = mongoose.model('Salesperson', salespersonSchema);
