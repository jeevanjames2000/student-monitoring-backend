const mongoose = require("mongoose");

// Define faculty schema
const facultySchema = new mongoose.Schema({
  Id: {
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
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
});

// Create Faculty model
const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
