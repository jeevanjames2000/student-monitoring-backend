const { mongoose } = require("mongoose");

const studentSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  rollNumber: {
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
  exitTime: {
    type: Date,
    default: Date.now,
  },
  year: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  qrCode: {
    type: String,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
