const Customer = require('../../models/Customer');
const Salesperson = require('../../models/Salesperson');
const Contractor = require('../../models/Contractor');

const customerData = [
  { firstName: 'Paolo', lastName: 'Maldini' },
  { firstName: 'Andres', lastName: 'Iniesta' },
  { firstName: 'Xavi', lastName: 'Hernandez' },
  { firstName: 'Roberto', lastName: 'Baggio' }
];

module.exports = async function seedCustomers() {
  try {
    await Customer.deleteMany({});

    const salespeople = await Salesperson.find({});
    const contractors = await Contractor.find({});

    if (salespeople.length === 0 || contractors.length === 0) {
      throw new Error('Salespeople or Contractors must be seeded before Customers');
    }

    const customers = await Promise.all(
      customerData.map((cust, idx) => {
        return Customer.create({
          ...cust,
          email: `${cust.firstName.toLowerCase()}@example.com`,
          phone: `+30-6999-000${idx}`,
          address: `Street ${idx + 1}`,
          id_of_salesperson: salespeople[idx % salespeople.length]._id,
          id_of_contractor: contractors[idx % contractors.length]._id,
          orders: []
        });
      })
    );

    console.log(`✅ Seeded ${customers.length} customers`);
    return customers;
  } catch (error) {
    console.error('❌ Error seeding customers:', error);
    throw error;
  }
};
