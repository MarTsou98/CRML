// utils/seeds/salespersonSeed.js
const Salesperson = require('../../models/Salesperson');
const footballers = [
  { firstName: 'Θαίη', lastName: 'Αλεξίου' },
  { firstName: 'Σοφία', lastName: 'Λιόλου' },
  { firstName: 'Τηλέμαχος', lastName: 'Τσουρέλας' },
];
module.exports = async function seedSalespeople() {
  await Salesperson.deleteMany({});
  await Salesperson.insertMany(
    footballers.map(f => ({ ...f, role: 'Salesperson', customers: [], orders: [] }))
  );
  console.log('Salespeople seeded');
};
