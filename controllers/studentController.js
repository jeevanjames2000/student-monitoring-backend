const qr = require("qrcode");
const { Buffer } = require("buffer");
const Student = require("../models/Student");
const StudentQrCode = require("../models/StudentQrCode");

const generateQRCode = async (data) => {
  try {
    const qrCodeDataUri = await qr.toDataURL(JSON.stringify(data));
    return qrCodeDataUri;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Error generating QR code");
  }
};
module.exports = {
  register: async (req, res) => {
    try {
      const { userName, rollNumber, name, year, branch, password } = req.body;
      const existingStudent = await Student.findOne({ userName });

      if (existingStudent) {
        return res.status(400).json({ message: "Student already registered" });
      }

      const qrCodeData = {
        userName,
        rollNumber,
        name,
        year,
        branch,
      };
      const qrCodeDataUri = await generateQRCode(qrCodeData);

      const newStudent = new Student({
        rollNumber,
        userName,
        name,
        year,
        branch,
        password,
        qrCode: qrCodeDataUri, // Save QR code data URI to database
      });

      const savedStudent = await newStudent.save();

      res.status(201).json({ student: savedStudent });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { userName, password } = req.body;

      const student = await Student.findOne({ userName });
      console.log("student: ", student);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      if (student.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.status(200).json({ message: "Login successful", type: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  scanQR: async (req, res) => {},

  createPost: async (req, res) => {},
  getAllStudents: async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getStudentByRollNumber: async (req, res) => {
    try {
      const { rollNumber } = req.body;

      const student = await Student.findOne({ rollNumber });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateByRollNum: async (req, res) => {
    try {
      const { rollNumber, name, year, branch, exitTime, entryTime } = req.body;

      const student = await Student.findOne({ rollNumber });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      if (name) {
        student.name = name;
      }
      if (year) {
        student.year = year;
      }
      if (branch) {
        student.branch = branch;
      }
      if (entryTime) {
        student.entryTime = entryTime;
      }
      if (exitTime) {
        student.exitTime = exitTime;
      }

      const updatedStudent = await student.save();

      res.json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  generateQRCode: generateQRCode,
};
