const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Salesperson = require('../models/Salesperson');
const Manager = require('../models/Manager');

mongoose.connect('mongodb://127.0.0.1:27017/kitchen_crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

async function createUsers() {
  try {
    // 1️⃣ Create Salespeople
    const salespeopleData = [
      { firstName: 'Sofia', lastName: 'Voutsa', username: 'Sofia', password: 'pass123' },
      { firstName: 'Thei', lastName: 'Kati', username: 'Thei', password: 'pass123' },

    ];

    for (const sp of salespeopleData) {
      const salesperson = new Salesperson({
        firstName: sp.firstName,
        lastName: sp.lastName,
        Role: 'salesperson'
      });
      await salesperson.save();

      const hashedPassword = await bcrypt.hash(sp.password, 10);
      const user = new User({
        username: sp.username,
        password: hashedPassword,
        role: 'salesperson',
        salesperson_id: salesperson._id
      });
      await user.save();
      console.log(`Created salesperson user: ${user.username}`);
    }

    // 2️⃣ Create Managers (with pseudo-salesperson)
    const managersData = [
      { firstName: 'Tilemachos', lastName: 'Tsourelas', username: 'Tilemachos', password: 'pass123' },
      { firstName: 'Tania', lastName: 'Beesly', username: 'Tania', password: 'pass123' },
    ];

    for (const m of managersData) {
      // Create Manager
      const manager = new Manager({
        firstName: m.firstName,
        lastName: m.lastName,
        Role: 'manager'
      });
      await manager.save();

      // Create pseudo-salesperson for manager to attach to orders
      const pseudoSP = new Salesperson({
        firstName: manager.firstName,
        lastName: manager.lastName,
        Role: 'manager'
      });
      await pseudoSP.save();

      manager.pseudoSalespersonId = pseudoSP._id;
      await manager.save();

      // Create login user
      const hashedPassword = await bcrypt.hash(m.password, 10);
      const user = new User({
        username: m.username,
        password: hashedPassword,
        role: 'manager',
        manager_id: manager._id,
        salesperson_id: pseudoSP._id // use pseudo-salesperson for order linking
      });
      await user.save();
      console.log(`Created manager user: ${user.username}`);
    }

    console.log('All users created successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating users:', err);
    mongoose.disconnect();
  }
}

createUsers();
