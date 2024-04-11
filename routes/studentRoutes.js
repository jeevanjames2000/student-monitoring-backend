// studentRoutes.js

const express = require("express");
const router = express.Router();

// Import student controller
const studentController = require("../controllers/studentController");

// Define routes
router.post("/register", studentController.register);
router.post("/login", studentController.login);
router.post("/scanQR", studentController.scanQR);
router.post("/insertStudent", studentController.insertStudent);
router.get("/getAllStudents", studentController.getAllStudents);
router.put("/updateByRollNum", studentController.updateByRollNum);
router.delete(
  "/deleteStudentByRollNumber/:rollNumber",
  studentController.deleteStudentByRollNumber
);
router.get("/students", studentController.getStudentByRollNumber);

module.exports = router;
