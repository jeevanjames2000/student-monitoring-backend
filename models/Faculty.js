const mongoose = require("mongoose");

// Define faculty schema
const facultySchema = new mongoose.Schema({
  emplyoeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  entryTime: {
    type: Date,
    default: Date.now,
  },
  branch: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  exitTime: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
  },
});

// Create Faculty model
const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
