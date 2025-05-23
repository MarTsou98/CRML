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
    timi_Timokatalogou: { type: Number, required: true },
    timi_Polisis: { type: Number, required: true },
    cash: { type: Number, required: true },
    bank: { type: Number, required: true },
    contractor_Share_Cash: { type: Number },
    contractor_Share_Bank: { type: Number },
    customer_Share_Cash: { type: Number },
    customer_Share_Bank: { type: Number },
    FPA: { type: Number },
    payments: [
      {
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        method: { type: String, enum: ['Cash', 'Bank'], required: true },
        notes: { type: String }
      }
    ],
    damages: [
      {
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        notes: { type: String }
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



module.exports = mongoose.model('Order', orderSchema);