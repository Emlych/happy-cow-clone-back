const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

// mongoose.connect("mongodb://localhost/happy-cow");
mongoose.connect(process.env.MONGODB_URI);

//import routes
const userRoutes = require("./routes/user");
app.use(userRoutes);

//Page not found
app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found .." });
});

//launch server
app.listen(process.env.PORT || 4000, () => {
  console.log("Server has started");
});
