const mongoose = require("mongoose");

// Define faculty schema
const facultySchema = new mongoose.Schema({
  emplyoeeId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  entryTime: {
    type: String,
  },
  branch: {
    type: String,
    required: true,
  },
  user: {
    type: String,
  },
  designation: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  exitTime: {
    type: String,
  },
  password: {
    type: String,
  },
  qrCode: {
    type: String,
  },
});

// Create Faculty model
const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
