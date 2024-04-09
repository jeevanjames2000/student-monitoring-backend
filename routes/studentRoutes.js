// studentRoutes.js

const express = require("express");
const router = express.Router();

// Import student controller
const studentController = require("../controllers/studentController");

// Define routes
router.post("/register", studentController.register);
router.post("/login", studentController.login);
router.post("/scanQR", studentController.scanQR);
router.post("/post", studentController.createPost);
router.get("/getAllStudents", studentController.getAllStudents);
router.put("/updatestudent", studentController.updateByRollNum);
router.get("/students", studentController.getStudentByRollNumber);
router.get("/allstudents", studentController.getAllStudents);

module.exports = router;
