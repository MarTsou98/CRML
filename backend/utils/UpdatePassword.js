const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // adjust path if needed

async function updatePassword(username, plainPassword) {
  try {
    await mongoose.connect('mongodb://localhost:27017/kitchen_crm');
    
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);

    const result = await User.updateOne({ username }, { password: hashed });
    console.log('Password updated:', result);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error updating password:', err);
  }
}

updatePassword('m', 'm'); // ✅ replace with real values
