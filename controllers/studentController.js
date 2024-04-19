const qr = require("qrcode");
const { Buffer } = require("buffer");
const Student = require("../models/Student");
const moment = require("moment");
const { DateTime } = require("luxon");

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
  scanQR: async (req, res) => {},

  insertStudent: async (req, res) => {
    try {
      const { name, rollNumber, year, branch, entryTime, exitTime } = req.body;

      const existingStudent = await Student.findOne({ rollNumber });

      if (existingStudent) {
        return res
          .status(400)
          .json({ message: "Student with this rollNumber already exists" });
      }
      const qrCodeData = {
        user: "student",
        rollNumber,
        name,
        year,
        branch,
      };
      const qrCodeDataUri = await generateQRCode(qrCodeData);
      const newStudent = new Student({
        name,
        user: "student",
        rollNumber,
        year,
        branch,
        entryTime,
        exitTime,
        qrCode: qrCodeDataUri,
      });

      const savedStudent = await newStudent.save();

      res.status(201).json(savedStudent);
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

  deleteStudentByRollNumber: async (req, res) => {
    try {
      const { rollNumber } = req.params;

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
      const { rollNumber } = req.body;

      const student = await Student.findOne({ rollNumber });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 5);
      currentTime.setMinutes(currentTime.getMinutes() + 30);

      const exitTime = student.exitTime;

      const timeDifferenceInMilliseconds =
        currentTime.getTime() - exitTime.getTime();
      const totalTimeOutsideInMinutes = Math.round(
        timeDifferenceInMilliseconds / (1000 * 60)
      );

      student.totalTime = totalTimeOutsideInMinutes;

      student.entryTime = currentTime;

      student.markModified("entryTime");
      student.markModified("totalTime");

      const savedStudent = await student.save();

      res.status(200).json({
        message: "Student entry time updated successfully",
        student: {
          ...savedStudent._doc,
          entryTime: currentTime.toISOString().slice(0, 19).replace("T", " "),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  exitStudent: async (req, res) => {
    try {
      const { rollNumber } = req.body;

      const student = await Student.findOne({ rollNumber });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 5);
      currentTime.setMinutes(currentTime.getMinutes() + 30);

      student.exitTime = currentTime;

      student.markModified("exitTime");

      const savedStudent = await student.save();

      res.status(200).json({
        message: "Student exit time updated successfully",
        student: {
          ...savedStudent._doc,
          exitTime: currentTime.toISOString().slice(0, 19).replace("T", " "),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  generateQRCode: generateQRCode,
};
