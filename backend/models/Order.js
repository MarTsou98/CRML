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
    enum: ["Σύνθεση Ερμαρίων", "Κανονική"]
  },
  orderNotes: { type: String },

 DateOfOrder: {
  type: Date,
  default: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    return today;
  },
  required: true
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
    required: true
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
    Notes: { type: String },
    _skipRemainingShareCalc: { type: Boolean, default: false }
  }
}, { timestamps: true });

/** Set default salesperson_id to specific ObjectId if null on new */
orderSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      if (!this.salesperson_id) {
        this.salesperson_id = new mongoose.Types.ObjectId('64c9e3c7f8d2c01a23456789'); // <-- use new here
      }
      if (this.customer_id) {
        await Customer.findByIdAndUpdate(this.customer_id, { $addToSet: { orders: this._id } });
      }
      if (this.contractor_id) {
        await Contractor.findByIdAndUpdate(this.contractor_id, { $addToSet: { orders: this._id } });
      }
      if (this.salesperson_id) {
        await Salesperson.findByIdAndUpdate(this.salesperson_id, { $addToSet: { orders: this._id } });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});


/** Calculate profit before saving */
orderSchema.pre('save', function (next) {
  const catalogPrice = this.moneyDetails.timi_Timokatalogou;
  const salesPrice = this.moneyDetails.timi_Polisis;

  const profit = salesPrice - catalogPrice;
  this.moneyDetails.profit = profit;

  if (profit < 0) {
    return next(new Error('Profit cannot be negative'));
  }
  next();
});

/** Calculate total damages */
orderSchema.pre('save', function (next) {
  if (Array.isArray(this.moneyDetails.damages)) {
    const total = this.moneyDetails.damages.reduce((sum, item) => sum + (item.amount || 0), 0);
    this.moneyDetails.totaldamages = total;
  }
  next();
});

/** Calculate total paid */
orderSchema.pre('save', function (next) {
  if (Array.isArray(this.moneyDetails.payments)) {
    const total = this.moneyDetails.payments.reduce((sum, item) => sum + (item.amount || 0), 0);
    this.moneyDetails.totalpaid = total;
  } else {
    this.moneyDetails.totalpaid = 0;
  }
  next();
});

/** Calculate tax (FPA) */
orderSchema.pre('save', function (next) {
  const salesPrice = this.moneyDetails.bank;
  const tax = salesPrice - salesPrice / 1.24; // 24% tax assumed
  this.moneyDetails.FPA = tax;
  next();
});

/** Calculate remaining cash and bank */
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

/** Calculate remaining shares unless skipping recalculation */
orderSchema.pre('save', function (next) {
  if (this.moneyDetails._skipRemainingShareCalc) {
    return next();
  }

  if (!Array.isArray(this.moneyDetails.payments)) return next();

  const sumPayments = (payer, method) => {
    return this.moneyDetails.payments
      .filter(p => p.payer === payer && p.method === method)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const contractorPaidCash = sumPayments('Contractor', 'Cash');
  const contractorPaidBank = sumPayments('Contractor', 'Bank');
  const contractorTotalCash = this.moneyDetails.contractor_Share_Cash || 0;
  const contractorTotalBank = this.moneyDetails.contractor_Share_Bank || 0;
  this.moneyDetails.contractor_remainingShare_Cash = contractorTotalCash - contractorPaidCash;
  this.moneyDetails.contractor_remainingShare_Bank = contractorTotalBank - contractorPaidBank;

  const customerPaidCash = sumPayments('Customer', 'Cash');
  const customerPaidBank = sumPayments('Customer', 'Bank');
  const customerTotalCash = this.moneyDetails.customer_Share_Cash || 0;
  const customerTotalBank = this.moneyDetails.customer_Share_Bank || 0;
  this.moneyDetails.customer_remainingShare_Cash = customerTotalCash - customerPaidCash;
  this.moneyDetails.customer_remainingShare_Bank = customerTotalBank - customerPaidBank;

  next();
});

module.exports = mongoose.model('Order', orderSchema);
