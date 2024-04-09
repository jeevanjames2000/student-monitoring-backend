// facultyRoutes.js

const express = require("express");
const router = express.Router();

// Import faculty controller
const facultyController = require("../controllers/facultyController");

// Define routes
router.post("/register", facultyController.register);
router.post("/login", facultyController.login);
router.post("/scanQR", facultyController.scanQR);
router.post("/post", facultyController.createPost);
router.get("/", facultyController.getAllFaculty);

module.exports = router;
