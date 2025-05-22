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
    const salesperson = await Salesperson.create({
      firstName: 'Ronaldo',
      lastName: 'Nazário',
      Role: 'Salesperson',
    });
    const manager = await Manager.create({
      firstName: 'Zinedine',
      lastName: 'Zidane',
      Role: 'Manager',
    });
    // Create users
    const users = await User.insertMany([
      {
        username: 'zidane',
        role: 'manager',
        password: '',
        manager_id: manager._id
      },
      {
        username: 'ronaldo',
        role: 'salesperson',
        password: '',
        salesperson_id: salesperson._id
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
