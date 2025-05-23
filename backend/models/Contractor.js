const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
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

   orders: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Order'
     }
   ]}, { timestamps: true });


   

module.exports = mongoose.model('Contractor', contractorSchema);
