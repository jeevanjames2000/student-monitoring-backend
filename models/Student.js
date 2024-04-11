const { mongoose } = require("mongoose");

const studentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
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
    type: String,
  },
  exitTime: {
    type: String,
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
    required: true,
  },
  qrCode: {
    type: String,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
