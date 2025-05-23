const mongoose = require('mongoose');
const Contractor = require('../../models/Contractor');
const Salesperson = require('../../models/Salesperson');

const contractorsData = [
  { firstName: 'Giannis', lastName: 'Papadopoulos', role: 'Contractor' },
  { firstName: 'Χρήστος', lastName: 'Αλεξίου', role: 'Contractor' },
  { firstName: 'Νίκος', lastName: 'Παπαζογλου', role: 'Contractor' },
 
];

async function seedContractors() {
  try {
    await Contractor.deleteMany({});

    const salespeople = await Salesperson.find({});
    if (salespeople.length === 0) {
      console.warn('⚠️ No salespeople found. Contractors will be seeded without salesperson references.');
    }

    const contractors = await Promise.all(
      contractorsData.map((contractor, idx) => {
        return Contractor.create({
          firstName: contractor.firstName,
          lastName: contractor.lastName,
          Role: contractor.role,
          salesperson_id: salespeople.length > 0 ? salespeople[idx % salespeople.length]._id : null,
          customers: [],
          orders: []
        });
      })
    );

    console.log(`✅ Seeded ${contractors.length} contractors.`);
    return contractors;
  } catch (err) {
    console.error('❌ Error seeding contractors:', err.message);
    throw err;
  }
}

module.exports = seedContractors;
