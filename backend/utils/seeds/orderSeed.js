const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Customer = require('../../models/Customer');
const Contractor = require('../../models/Contractor');
const Salesperson = require('../../models/Salesperson');

const seedOrders = async () => {
  try {
    await Order.deleteMany({});
    const customers = await Customer.find({});
    const contractors = await Contractor.find({});
    const salespeople = await Salesperson.find({});

    if (!customers.length || !contractors.length || !salespeople.length) {
      throw new Error('❌ You must seed customers, contractors, and salespeople before orders.');
    }

    const invoiceTypes = ['Timologio', 'Apodiksi'];

    const orderData = [];

    for (let i = 0; i < 5; i++) {
      const customer = customers[i % customers.length];
      const contractor = contractors[i % contractors.length];
      const salesperson = salespeople[i % salespeople.length];

      const timi_Timokatalogou = 8000 + i * 500;  // Catalog price
      const timi_Polisis = 10000 + i * 600;       // Sales price

      const cash = 4000 + i * 200;
      const bank = timi_Polisis - cash;

      const contractor_Share_Cash = cash * 0.2;
      const contractor_Share_Bank = bank * 0.2;

      const customer_Share_Cash = cash * 0.8;
      const customer_Share_Bank = bank * 0.8;

      const payments = [
        { amount: cash, method: 'Cash', notes: 'Initial deposit' },
        { amount: bank, method: 'Bank', notes: 'Final payment' }
      ];

      const damages = [
        { amount: 100 * i, notes: 'Scratch on cabinet' }
      ];

      const discounts = [
        { amount: 200 * i, notes: 'Loyalty discount' }
      ];

      orderData.push({
        Lock: false,
        invoiceType: invoiceTypes[i % 2],
        customer_id: customer._id,
        salesperson_id: salesperson._id,
        contractor_id: contractor._id,
        moneyDetails: {
          timi_Timokatalogou,
          timi_Polisis,
          cash,
          bank,
          contractor_Share_Cash,
          contractor_Share_Bank,
          customer_Share_Cash,
          customer_Share_Bank,
          payments,
          damages,
          discounts
        }
      });
    }

    const createdOrders = await Order.insertMany(orderData);
    console.log(`✅ Seeded ${createdOrders.length} orders.`);
  } catch (err) {
    console.error('❌ Error seeding orders:', err.message);
  }
};

module.exports = seedOrders;
