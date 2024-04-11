const mongoose = require("mongoose");

// Define QrCode schema
const StudentQrCodeSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  year: {
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
  exitTime: {
    type: String,
  },
  qrCode: {
    type: String,
  },
});

// Create QrCode model
const StudentQrCode = mongoose.model("StudentQrCode", StudentQrCodeSchema);

module.exports = StudentQrCode;
