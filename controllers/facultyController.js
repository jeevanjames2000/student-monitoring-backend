const Faculty = require("../models/Faculty");
const qr = require("qrcode");
const { Buffer } = require("buffer");

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
      const { emplyoeeId, name, branch, designation, userName, password } =
        req.body;
      const existingFaculty = await Faculty.findOne({ userName });

      if (existingFaculty) {
        return res.status(400).json({ message: "User already registered" });
      }

      const qrCodeData = {
        user: "faculty",
        emplyoeeId,
        name,
        branch,
        designation,
      };
      const qrCodeDataUri = await generateQRCode(qrCodeData);

      const newFaculty = new Faculty({
        emplyoeeId,
        name,
        user: "faculty",
        branch,
        designation,
        userName,
        password,
        qrCode: qrCodeDataUri,
      });

      const savedFaculty = await newFaculty.save();

      res.status(201).json({ faculty: savedFaculty });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { userName, password } = req.body;

      const faculty = await Faculty.findOne({ userName });

      if (!faculty) {
        return res.status(404).json({ message: "User not found" });
      }

      if (faculty.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.status(200).json({ message: "Login successful", type: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  insertFaculty: async (req, res) => {
    try {
      const { name, emplyoeeId, designation, branch, entryTime, exitTime } =
        req.body;

      // Check if the student with the given rollNumber already exists
      const existingFaculty = await Faculty.findOne({ emplyoeeId });

      if (existingFaculty) {
        return res
          .status(400)
          .json({ message: "User with this rollNumber already exists" });
      }

      const qrCodeData = {
        user: "faculty",
        name,
        emplyoeeId,
        designation,
        branch,
        entryTime,
        exitTime,
      };
      const qrCodeDataUri = await generateQRCode(qrCodeData);

      // Create a new student object without password and userName
      const newFaculty = new Faculty({
        name,
        user: "faculty",
        emplyoeeId,
        designation,
        branch,
        entryTime,
        exitTime,
        qrCode: qrCodeDataUri,
      });

      // Save the new student to the database
      const savedStudent = await newFaculty.save();

      res.status(201).json(savedStudent); // Return the saved student
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllFaculty: async (req, res) => {
    try {
      const faculty = await Faculty.find();
      res.status(200).json(faculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFacultyById: async (req, res) => {
    try {
      const { emplyoeeId } = req.body;

      const faculty = await Faculty.findOne({ emplyoeeId });

      if (!faculty) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(faculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateById: async (req, res) => {
    try {
      const { emplyoeeId, designation, name, branch, exitTime, entryTime } =
        req.body;

      const faculty = await Faculty.findOne({ emplyoeeId });

      if (!faculty) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) {
        faculty.name = name;
      }
      if (designation) {
        faculty.designation = designation;
      }
      if (branch) {
        faculty.branch = branch;
      }
      if (entryTime) {
        faculty.entryTime = entryTime;
      }
      if (exitTime) {
        faculty.exitTime = exitTime;
      }

      const updatedFaculty = await faculty.save();

      res.json(updatedFaculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Delete student by rollNumber
  deleteFacultyById: async (req, res) => {
    try {
      const { emplyoeeId } = req.params;

      // Find the student by rollNumber and delete
      const faculty = await Faculty.findOneAndDelete({ emplyoeeId });

      if (!faculty) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User deleted successfully",
        faculty: faculty,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  entryFaculty: async (req, res) => {
    try {
      const { emplyoeeId } = req.body;

      const faculty = await Faculty.findOne({ emplyoeeId });

      if (!faculty) {
        return res.status(404).json({ message: "Faculty not found" });
      }

      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 5);
      currentTime.setMinutes(currentTime.getMinutes() + 30);

      // Check if exitTime is defined
      if (faculty.exitTime) {
        const exitTime = new Date(faculty.exitTime);

        const timeDifferenceInMilliseconds =
          currentTime.getTime() - exitTime.getTime();
        const totalTimeOutsideInMinutes = Math.round(
          timeDifferenceInMilliseconds / (1000 * 60)
        );
        faculty.totalTime = totalTimeOutsideInMinutes;
      }

      faculty.entryTime = currentTime;

      faculty.markModified("entryTime");
      faculty.markModified("totalTime");

      const savedFaculty = await faculty.save();

      res.status(200).json({
        message: "Faculty entry time updated successfully",
        faculty: {
          ...savedFaculty._doc,
          entryTime: currentTime.toISOString().slice(0, 19).replace("T", " "), // Format date and time for response
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  exitFaculty: async (req, res) => {
    try {
      const { emplyoeeId } = req.body;

      const faculty = await Faculty.findOne({ emplyoeeId });

      if (!faculty) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get current Indian Standard Time (IST)
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 5); // Add 5 hours for IST
      currentTime.setMinutes(currentTime.getMinutes() + 30); // Add 30 minutes for IST

      // Set exitTime to current Indian Standard Time
      faculty.exitTime = currentTime;

      // Mark exitTime property as modified
      faculty.markModified("exitTime");

      const savedfaculty = await faculty.save();

      res.status(200).json({
        message: "User exit time updated successfully",
        faculty: {
          ...savedfaculty._doc,
          exitTime: currentTime.toISOString().slice(0, 19).replace("T", " "), // Format date and time for response
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
