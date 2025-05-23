const Manager = require('../../models/Manager');
module.exports = async function seedManagers() {
  await Manager.deleteMany({});
  await Manager.create({ firstName: 'Τηλέμαχος', lastName: 'Τσουρέλας', role: 'Manager' });
  console.log('Managers seeded');
};