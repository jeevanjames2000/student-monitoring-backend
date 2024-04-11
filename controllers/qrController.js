const qr = require("qrcode");
const { Buffer } = require("buffer");
const FacultyQrCode = require("../models/FacultyQrCode");
const StudentQrCode = require("../models/StudentQrCode");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

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
  generateNewQr: async (req, res) => {
    try {
      const {
        userType,
        rollNumber,
        emplyoeeId,
        branch,
        name,
        year,
        designation,
        entryTime,
        exitTime,
      } = req.body;

      if (!userType) {
        return res.status(400).json({
          success: false,
          message: "User type required",
        });
      }

      const data = {
        userType,
        rollNumber,
        emplyoeeId,
        branch,
        name,
        year,
        designation,
        entryTime,
        exitTime,
      };

      // Generate QR code
      const qrCodeDataUri = await generateQRCode(data);

      let user;

      // Check userType and update/create user
      if (userType === "student") {
        let existingUser = await Student.findOneAndUpdate(
          { rollNumber: rollNumber },
          { $set: { qrCode: qrCodeDataUri } },
          { new: true }
        );
        user = existingUser;
      } else if (userType === "faculty") {
        let existingUser = await Faculty.findOneAndUpdate(
          { emplyoeeId: emplyoeeId },
          { $set: { qrCode: qrCodeDataUri } },
          { new: true }
        );
        user = existingUser;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid user type",
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        qrCodeDataUri: qrCodeDataUri,
        user: user,
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({
        success: false,
        message: "Error generating QR code",
      });
    }
  },

  generateQRCode: generateQRCode,
};
