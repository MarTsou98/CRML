const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust path accordingly

async function createUser(username, plainPassword, role = 'salesperson') {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const user = new User({
      username,
      password: hashedPassword,
      role
    });

    await user.save();
    console.log(`User "${username}" created with role "${role}"!`);
  } catch (err) {
    console.error('Error creating user:', err.message);
  }
}


async function updatePassword(username, plainPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainPassword, salt);

  const result = await User.updateOne({ username }, { password: hashed });
  console.log('Password updated:', result);
}

async function run() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kitchen_crm');
    //await createUser('Tilemaxos','1234', 'manager'); // Create a manager
    await updatePassword('Thei', '1234'); // Optional: only if you need to reset right after
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
