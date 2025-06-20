const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  CustomerNotes: { type: String },
  firstName_normalized: { type: String, index: true },  // Add this!
  lastName_normalized: { type: String, index: true },   // And this!
  email: { type: String, unique: true },
  phone: { type: String },
  address: { type: String },
  id_of_salesperson: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesperson' },
  id_of_contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

customerSchema.pre('save', function (next) {
  this.firstName_normalized = normalizeGreek(this.firstName || '');
  this.lastName_normalized = normalizeGreek(this.lastName || '');
  next();
});

module.exports = mongoose.model('Customer', customerSchema);

function normalizeGreek(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}