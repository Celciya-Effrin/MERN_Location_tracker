const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Ensures random ID is not duplicated
  },
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
