// utils/seeds/salespersonSeed.js
const Salesperson = require('../../models/Salesperson');
const footballers = [
  { firstName: 'Diego', lastName: 'Maradona' },
  { firstName: 'Zinedine', lastName: 'Zidane' },
  { firstName: 'Ronaldinho', lastName: 'Gaúcho' },
];
module.exports = async function seedSalespeople() {
  await Salesperson.deleteMany({});
  await Salesperson.insertMany(
    footballers.map(f => ({ ...f, role: 'Salesperson', customers: [], orders: [] }))
  );
  console.log('Salespeople seeded');
};
