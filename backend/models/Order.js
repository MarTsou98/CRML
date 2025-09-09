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

    // Original shares (editable)
    contractor_Share_Cash: { type: Number, default: 0 },
    contractor_Share_Bank: { type: Number, default: 0 },
    customer_Share_Cash: { type: Number, default: 0 },
    customer_Share_Bank: { type: Number, default: 0 },

    // Remaining shares (calculated automatically)
    contractor_remainingShare_Cash: { type: Number, default: 0 },
    contractor_remainingShare_Bank: { type: Number, default: 0 },
    customer_remainingShare_Cash: { type: Number, default: 0 },
    customer_remainingShare_Bank: { type: Number, default: 0 },

    remainingCash: { type: Number, default: 0 },
    remainingBank: { type: Number, default: 0 },

    payments: [
      {
        amount: { type: Number },
        method: { type: String, enum: ['Cash', 'Bank'] },
        payer: { type: String, enum: ['Customer', 'Contractor'] },
        notes: { type: String },
        DateOfPayment: { type: Date, default: () => new Date() }
      }
    ],

    damages: [
      {
        amount: { type: Number },
        notes: { type: String },
        typeOfDamage: { type: String, enum: ['Μεταφορά εξωτερικού', 'Μεταφορά εσωτερικού', 'Τοποθέτηση', 'Διάφορα'] },
        DateOfDamages: { type: Date, default: () => new Date() }
      }
    ],

    totalpaid: { type: Number, default: 0 },
    totaldamages: { type: Number, default: 0 },
    FPA: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    totalCash: { type: Number, default: 0 },
    totalBank: { type: Number, default: 0 },
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

 // if (profit < 0) {
   // return next(new Error('Profit cannot be negative'));
  //}
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

orderSchema.pre('save', function (next) {
  const md = this.moneyDetails;

  // 1. Total payments
  if (Array.isArray(md.payments)) {
    md.totalpaid = md.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  } else md.totalpaid = 0;

  // 2. Total damages
  if (Array.isArray(md.damages)) {
    md.totaldamages = md.damages.reduce((sum, d) => sum + (d.amount || 0), 0);
  } else md.totaldamages = 0;

  // 3. Profit
  const catalogPrice = md.timi_Timokatalogou || 0;
  const salesPrice = md.timi_Polisis || 0;
  md.profit = salesPrice - catalogPrice;

  // 4. Tax (FPA)
  //md.FPA = salesPrice - salesPrice / 1.24;

  // 5. Remaining cash/bank
  const paidCash = (md.payments || []).filter(p => p.method === 'Cash').reduce((sum, p) => sum + (p.amount || 0), 0);
  const paidBank = (md.payments || []).filter(p => p.method === 'Bank').reduce((sum, p) => sum + (p.amount || 0), 0);
  md.remainingCash = (md.cash || 0) - paidCash;
  md.remainingBank = (md.bank || 0) - paidBank;

  // 6. Remaining shares
  if (!md._skipRemainingShareCalc) {
    const sumPayments = (payer, method) => (md.payments || [])
      .filter(p => p.payer === payer && p.method === method)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    md.contractor_remainingShare_Cash = (md.contractor_Share_Cash || 0) - sumPayments('Contractor', 'Cash');
    md.contractor_remainingShare_Bank = (md.contractor_Share_Bank || 0) - sumPayments('Contractor', 'Bank');
    md.customer_remainingShare_Cash = (md.customer_Share_Cash || 0) - sumPayments('Customer', 'Cash');
    md.customer_remainingShare_Bank = (md.customer_Share_Bank || 0) - sumPayments('Customer', 'Bank');
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
