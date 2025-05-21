const mongoose = require('mongoose');
const Salesperson = require('./Salesperson');
const Contractor = require('./Contractor');
const Customer = require('./Customer');
const orderSchema = new mongoose.Schema({
    Lock: { type: Boolean, default: false },
    invoiceType: {
        type: String,
        enum: ['Timologio', 'Apodiksi'],  // Allowed values only
        //default: 'simple',            // Default if not specified
        required: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    salesperson_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salesperson'
    },
    contractor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contractor'
    },
    moneyDetails: {
        timi_Timokatalogou: {
            type: Number,
            required: true
        },
        timi_Polisis:{
            type: Number,
            required: true
        },
        cash:{
            type: Number,
            required: true
        },
        bank:{
            type: Number,
            required: true
        },
        contractor_Share_Cash:{
            type: Number
        },
        contractor_Share_Bank:{
            type: Number
        },
        customer_Share_Cash:{
            type: Number
        },
        customer_Share_Bank:{
            type: Number
        },
        FPA:{
            type: Number,
        },
         payments: [
    {
      amount: { type: Number },
      date: { type: Date, default: Date.now },
      method: { type: String, enum: ['Cash', 'Bank'], required: true },
      notes: { type: String } // optional
    }
  ],
  damages: [
    {
      amount: { type: Number },
      date: { type: Date, default: Date.now },
      notes: { type: String } // optional
    }
  ],
  totalpaid: {
    type: Number
  },
    totaldamages: {
        type: Number
    },
  discounts: [
    {
      amount: { type: Number },
      date: { type: Date, default: Date.now },
      notes: { type: String } // optional
    }
  ],
  profit: {
    type: Number
  }
    }
    },  { timestamps: true }); // Adds createdAt and updatedAt fields   



orderSchema.pre('save', function (next) {// calculate profit before saving
  const catalogPrice = this.moneyDetails.timi_Timokatalogou;
  const salesPrice = this.moneyDetails.timi_Polisis;

  // 1. Calculate profit
  const profit = salesPrice - catalogPrice;
  this.moneyDetails.profit = profit;

  // 2. Validate profit
  if (profit < 0) {
    return next(new Error('Profit cannot be negative'));
  }

  if (profit > salesPrice * 0.5) {
    return next(new Error('Profit exceeds 50% of sales price — check your pricing.'));
  }

  // 3. Proceed with saving
  next();
});
orderSchema.pre('save',  function (next) {//calculate total damages before saving and correct values.
// Make sure the damages array exists and is an array
  if (Array.isArray(this.moneyDetails.damages)) {
    // Sum up all damage amounts (safely)
    const total = this.moneyDetails.damages.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);

    // Save the total
    this.moneyDetails.totaldamages = total;
  } else {
    // If damages doesn't exist, default to 0
    this.moneyDetails.totaldamages = 0;
  }

  next(); // Always call next to continue the save process
});
orderSchema.pre('save',  function (next) {// calculate total paid before saving and correct values.
  if (Array.isArray(this.moneyDetails.payments)) {
    const total = this.moneyDetails.payments.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);
    this.moneyDetails.totalpaid = total;
  } else {
    this.moneyDetails.totalpaid = 0;
  }
  next();
});
orderSchema.pre('save',  function (next) {// calculate tax and profit before saving and correct values.
  const salesPrice = this.moneyDetails.timi_Polisis;
  const tax = salesPrice * 0.24; // Assuming 24% tax
  this.moneyDetails.FPA = tax;
  next();
});