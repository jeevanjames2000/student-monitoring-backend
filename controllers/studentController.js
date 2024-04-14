const qr = require("qrcode");
const { Buffer } = require("buffer");
const Student = require("../models/Student");

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

      res.status(200).json({ message: "Login successful", type: false });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  scanQR: async (req, res) => {},

  insertStudent: async (req, res) => {
    try {
      const { name, rollNumber, year, branch, entryTime, exitTime } = req.body;

      // Check if the student with the given rollNumber already exists
      const existingStudent = await Student.findOne({ rollNumber });

      if (existingStudent) {
        return res
          .status(400)
          .json({ message: "Student with this rollNumber already exists" });
      }

      // Create a new student object without password and userName
      const newStudent = new Student({
        name,
        rollNumber,
        year,
        branch,
        entryTime,
        exitTime,
      });

      // Save the new student to the database
      const savedStudent = await newStudent.save();

      res.status(201).json(savedStudent); // Return the saved student
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

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
  // Delete student by rollNumber
  deleteStudentByRollNumber: async (req, res) => {
    try {
      const { rollNumber } = req.params;

      // Find the student by rollNumber and delete
      const deletedStudent = await Student.findOneAndDelete({ rollNumber });

      if (!deletedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  entryStudent: async (req, res) => {
    try {
      // Extract data from request body
      const { rollNumber } = req.body;

      // Find the student in the database
      const student = await Student.findOne({ rollNumber });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Update the student's entryTime to current date and time
      student.entryTime = Date.now();

      // Save student data to the database
      const savedStudent = await student.save();

      // Send success response
      res.status(200).json({
        message: "Student entry time updated successfully",
        student: savedStudent,
      });
    } catch (error) {
      // Send error response
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  exitStudent: async (req, res) => {
    try {
      // Extract data from request body
      const { rollNumber } = req.body;

      // Find the student in the database
      const student = await Student.findOne({ rollNumber });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Update the student's exitTime to current date and time
      student.exitTime = Date.now();

      // Save student data to the database
      const savedStudent = await student.save();

      // Send success response
      res.status(200).json({
        message: "Student exit time updated successfully",
        student: savedStudent,
      });
    } catch (error) {
      // Send error response
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  generateQRCode: generateQRCode,
};
