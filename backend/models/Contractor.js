const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
  EnterpriseName: {
    type: String,
    required: true},
  VAT: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  },

    firstName: {
       type: String
     },
     lastName: {
       type: String
     },
     Role: {
       type: String
     },
     salesperson_id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Salesperson'
     },
     customers: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Customer'
     }
   ],
   phone: {
       type: String
   },
   email: {
       type: String
   },
   ContractorNotes: {
       type: String
   },
   orders: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Order'
     }
   ]}, { timestamps: true });


   

module.exports = mongoose.model('Contractor', contractorSchema);
