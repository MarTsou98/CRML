const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  
  password: { type: String }, // optional for now
  role: { type: String, enum: ['manager', 'salesperson'], required: true },
  salesperson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salesperson'
  }
},
 { timestamps: true });

module.exports = mongoose.model('User', userSchema);
