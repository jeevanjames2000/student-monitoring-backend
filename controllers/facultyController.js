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
        return res.status(400).json({ message: "Faculty already registered" });
      }

      const qrCodeData = {
        emplyoeeId,
        name,
        branch,
        designation,
      };
      const qrCodeDataUri = await generateQRCode(qrCodeData);

      const newFaculty = new Faculty({
        emplyoeeId,
        name,
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
        return res.status(404).json({ message: "Faculty not found" });
      }

      if (faculty.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.status(200).json({ message: "Login successful", type: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  scanQR: async (req, res) => {},

  createPost: async (req, res) => {},
  getAllFaculty: async (req, res) => {
    try {
      const faculty = await Faculty.find();
      res.status(200).json(faculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  generateQRCode: generateQRCode,
};
