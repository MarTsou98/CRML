// utils/seeds/seedAll.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const seedManagers = require('./managerSeed');
const seedSalespeople = require('./salespersonSeed');
const seedContractors = require('./contractorSeed');
const seedCustomers = require('./customerSeed');
const seedOrders = require('./orderSeed');

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kitchen_crm');
    console.log('DB connected');

    await seedManagers();
    await seedSalespeople();
    await seedContractors();
    await seedCustomers();
    await seedOrders();

    console.log('All seeds done!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.disconnect();
  }
}

seedAll();
