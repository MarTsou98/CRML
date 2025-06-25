const mongoose = require('mongoose');
const Salesperson = require('./Salesperson');

const customerSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  CustomerNotes: { type: String },
  firstName_normalized: { type: String, index: true },
  lastName_normalized: { type: String, index: true },
  email: { type: String, unique: true },
  phone: { type: String },
  address: { type: String },
  id_of_salesperson: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesperson' },
  id_of_contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

//const Salesperson = require('./Salesperson');
const Contractor = require('./Contractor'); // ✅ Import the Contractor model

customerSchema.pre('save', async function (next) {
  try {
    // Normalize names
    this.firstName_normalized = normalizeGreek(this.firstName || '');
    this.lastName_normalized = normalizeGreek(this.lastName || '');

    console.log('Pre-save hook triggered for Customer:', this._id);
    console.log('Is this a new customer?', this.isNew);
    console.log('Salesperson ID:', this.id_of_salesperson);
    console.log('Contractor ID:', this.id_of_contractor);

    // Update Salesperson's customers
    if (this.isNew && this.id_of_salesperson) {
      console.log('Updating salesperson with customer ID', this._id);
      await Salesperson.findByIdAndUpdate(
        this.id_of_salesperson,
        { $addToSet: { customers: this._id } }
      );
    }

    // ✅ Update Contractor's customers
    if (this.isNew && this.id_of_contractor) {
      console.log('Updating contractor with customer ID', this._id);
      await Contractor.findByIdAndUpdate(
        this.id_of_contractor,
        { $addToSet: { customers: this._id } }
      );
    }

    next();
  } catch (err) {
    console.error('Error in pre-save hook:', err);
    next(err);
  }
});


function normalizeGreek(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

module.exports = mongoose.model('Customer', customerSchema);
