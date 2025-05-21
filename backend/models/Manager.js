const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  Role:{
    type: String
  }
});

module.exports = mongoose.model('Manager', managerSchema);