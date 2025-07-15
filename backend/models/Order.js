const mongoose = require('mongoose');
const Salesperson = require('./Salesperson');
const Contractor = require('./Contractor');
const Customer = require('./Customer');
const orderSchema = new mongoose.Schema({
  Lock: { type: Boolean, default: false },
  invoiceType: {
    type: String,
    enum: ['Timologio', 'Apodiksi'],
    required: true
  },
  orderType: {
    type: String,
    enum:["Σύνθεση Ερμαρίων", "Κανονική"]
  },
  orderNotes: {
     type: String
     },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  customer_notes: { type: String },
  salesperson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salesperson'
  },
  contractor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor'
  },
contractors_notes: { type: String },
orderedFromCompany: {
  type: String,
  enum: ['Lube', 'Decopan', 'Sovet', 'Doors', 'Appliances', 'CounterTop'],
  required: true // or false if it's optional
},
  moneyDetails: {
    timi_Timokatalogou: { type: Number, required: true },
    timi_Polisis: { type: Number, required: true },
    cash: { type: Number, required: true },
    bank: { type: Number, required: true },
    remainingCash: { type: Number, default: function () { return this.moneyDetails.cash; } },
    remainingBank: { type: Number, default: function () { return this.moneyDetails.bank; } },
    contractor_Share_Cash: { type: Number },
    contractor_remainingShare_Cash: { type: Number },
    contractor_Share_Bank: { type: Number },
    contractor_remainingShare_Bank: { type: Number },
    customer_Share_Cash: { type: Number },
    customer_remainingShare_Cash: { type: Number },
    customer_Share_Bank: { type: Number },
    customer_remainingShare_Bank: { type: Number },
    FPA: { type: Number },
    payments: [
      {
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        method: { type: String, enum: ['Cash', 'Bank'], required: true },
        payer: { type: String, enum: ['Customer', 'Contractor'], required: true },
        notes: { type: String }
      }
    ],
  damages: [
  {
    amount: { type: Number },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    typeOfDamage: {
      type: String,
      enum: ['Μεταφορά εξωτερικού', 'Μεταφορά εσωτερικού', 'Τοποθέτηση', 'Διάφορα'],
      required: false
    }
  }
],

    totalpaid: { type: Number },
    totaldamages: { type: Number },
    discounts: [
      {
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        notes: { type: String }
      }
    ],
    profit: { type: Number },
    totalCash: { type: Number },
    totalBank: { type: Number },
    Notes: { type: String }
  }
}, { timestamps: true });




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
  } //else {
    // If damages doesn't exist, default to 0
  // this.moneyDetails.totaldamages = 0;
  //}

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
  const salesPrice = this.moneyDetails.bank;
  const tax =salesPrice - salesPrice / 1.24; // Assuming 24% tax
  this.moneyDetails.FPA = tax;
  next();
});

orderSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      // Update customer orders if customer_id present
      if (this.customer_id) {
        await Customer.findByIdAndUpdate(
          this.customer_id,
          { $addToSet: { orders: this._id } }
        );
      }
      // Update contractor orders if contractor_id present
      if (this.contractor_id) {
        await Contractor.findByIdAndUpdate(
          this.contractor_id,
          { $addToSet: { orders: this._id } }
        );
      }
      // Update salesperson orders if salesperson_id present
      if (this.salesperson_id) {
        await Salesperson.findByIdAndUpdate(
          this.salesperson_id,
          { $addToSet: { orders: this._id } }
        );
      }
    }
    next(); // proceed with saving
  } catch (error) {
    next(error); // pass error to Mongoose middleware
  }
});
orderSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      // Update customer orders if contractor_is present
      if (this.contractor_id) {
        await Contractor.findByIdAndUpdate(
          this.customer_id,
          { $addToSet: { orders: this._id } }
        );
      }
    
      // Update salesperson orders if salesperson_id present
      if (this.salesperson_id) {
        await Salesperson.findByIdAndUpdate(
          this.salesperson_id,
          { $addToSet: { orders: this._id } }
        );
      }
    }
    next(); // proceed with saving
  } catch (error) {
    next(error); // pass error to Mongoose middleware
  }
});
orderSchema.pre('save', function (next) {
  if (Array.isArray(this.moneyDetails.payments)) {
    const paidCash = this.moneyDetails.payments
      .filter(p => p.method === 'Cash')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const paidBank = this.moneyDetails.payments
      .filter(p => p.method === 'Bank')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    this.moneyDetails.remainingCash = this.moneyDetails.cash - paidCash;
    this.moneyDetails.remainingBank = this.moneyDetails.bank - paidBank;
  }
  next();
});
orderSchema.pre('save', function (next) {
  if (!Array.isArray(this.moneyDetails.payments)) return next();

  // Helper for reducing payment totals
  const sumPayments = (payer, method) => {
    return this.moneyDetails.payments
      .filter(p => p.payer === payer && p.method === method)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  // Calculate paid amounts
  const contractorPaidCash = sumPayments('Contractor', 'Cash');
  const contractorPaidBank = sumPayments('Contractor', 'Bank');
  const customerPaidCash = sumPayments('Customer', 'Cash');
  const customerPaidBank = sumPayments('Customer', 'Bank');

  // Contractor
  const contractorTotalCash = this.moneyDetails.contractor_Share_Cash || 0;
  const contractorTotalBank = this.moneyDetails.contractor_Share_Bank || 0;
  this.moneyDetails.contractor_remainingShare_Cash = contractorTotalCash - contractorPaidCash;
  this.moneyDetails.contractor_remainingShare_Bank = contractorTotalBank - contractorPaidBank;

  // Customer
  const customerTotalCash = this.moneyDetails.customer_Share_Cash || 0;
  const customerTotalBank = this.moneyDetails.customer_Share_Bank || 0;
  this.moneyDetails.customer_remainingShare_Cash = customerTotalCash - customerPaidCash;
  this.moneyDetails.customer_remainingShare_Bank = customerTotalBank - customerPaidBank;

  next();
});



module.exports = mongoose.model('Order', orderSchema);