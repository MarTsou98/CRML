// models/person.js
const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  Role: { type: String }
}, { timestamps: true });

module.exports = personSchema;
