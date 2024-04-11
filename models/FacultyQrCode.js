const mongoose = require("mongoose");

// Define QrCode schema
const FacultyQrCodeSchema = new mongoose.Schema({
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

  exitTime: {
    type: String,
  },
  qrCode: {
    type: String,
  },
});

// Create QrCode model
const FacultyQrCode = mongoose.model("FacultyQrCode", FacultyQrCodeSchema);

module.exports = FacultyQrCode;
