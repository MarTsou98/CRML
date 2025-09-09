// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Salesperson = require('./Salesperson');
const Manager = require('./Manager');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['manager', 'salesperson'], required: true },
  salesperson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesperson' },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' } // optional for managers
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Assign salesperson permissions if user is a manager
userSchema.methods.getEffectivePermissions = async function() {
  if (this.role === 'manager') {
    // Load manager's document
    const manager = await Manager.findById(this.manager_id).lean();
    if (!manager) return null;

    // Merge all salesperson fields
    const permissions = {
      firstName: manager.firstName,
      lastName: manager.lastName,
      Role: manager.Role,
      customers: manager.customers || [],
      orders: manager.orders || []
    };
    return permissions;
  } else if (this.role === 'salesperson') {
    const salesperson = await Salesperson.findById(this.salesperson_id).lean();
    if (!salesperson) return null;
    return {
      firstName: salesperson.firstName,
      lastName: salesperson.lastName,
      Role: salesperson.Role,
      customers: salesperson.customers || [],
      orders: salesperson.orders || []
    };
  }
  return null;
};

module.exports = mongoose.model('User', userSchema);
