const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors"); // Import cors
app.use(cors());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://jeevanjames2000:nyv3wW4zpq91oSY3@jeevan.e2hrudn.mongodb.net/?retryWrites=true&w=majority&appName=Jeevan0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
