const mongoose = require('mongoose');
const User = require('../../models/User');
const Salesperson = require('../../models/Salesperson');
const Manager = require('../../models/Manager');

const MONGO_URI = 'mongodb://localhost:27017/kitchen_crm'; // Replace with your MongoDB URI

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);

    // Clear existing users
    await User.deleteMany({});
    await Salesperson.deleteMany({}); // Optional, if reseeding

    // Create a salesperson
    const salesperson1 = await Salesperson.create({
      firstName: 'Θαίη',
      lastName: 'Αλεξίου',
      Role: 'Salesperson',
    });
    const salesperson2 = await Salesperson.create({
      firstName: 'Σοφία',
      lastName: 'Λιόλου',
      Role: 'Salesperson',
    });
    const salesperson3 = await Salesperson.create({
      firstName: 'Βασιλική',
      lastName: 'Μάλλα',
      Role: 'Salesperson',
    });
    const manager = await Manager.create({
      firstName: 'Τηλέμαχος',
      lastName: 'Τσουρέλας',
      Role: 'Manager',
    });
    // Create users
    const users = await User.insertMany([
      {
        username: 'Tilemaxos',
        role: 'manager',
        password: '',
        manager_id: manager._id
      },
      {
        username: 'Thei',
        role: 'salesperson',
        password: '',
        salesperson_id: salesperson1._id
      },
       {
        username: 'Sofia',
        role: 'salesperson',
        password: '',
        salesperson_id: salesperson2._id
      },
       {
        username: 'Vasiliki',
        role: 'salesperson',
        password: '',
        salesperson_id: salesperson3._id
      }
    ]);
    

    console.log('Users and Salesperson seeded:', users);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedUsers();
