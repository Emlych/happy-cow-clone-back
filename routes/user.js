const express = require("express");
const router = express.Router();

//import model
const User = require("../models/User");

// Password management
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//Create a new User
router.post("/user/signup", async (req, res) => {
  console.log("route: /user/signup");
  try {
    if (!req.fields.username)
      res.status(400).json({ message: "No username provided" });
    if (!req.fields.email)
      res.status(400).json({ message: "No email provided" });
    if (await User.findOne({ username: req.fields.username }))
      res.status(400).json({ message: "User already exists" });
    else {
      //generate hash and token
      const password = req.fields.password;
      const newSalt = uid2(16);
      const newHash = SHA256(password + newSalt).toString(encBase64);
      const newToken = uid2(16);

      //register new user
      const newUser = new User({
        email: req.fields.email,
        username: req.fields.username,
        token: newToken,
        hash: newHash,
        salt: newSalt,
      });
      await newUser.save();
      res.json({ newUser: newUser });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Login
router.post("/user/login", async (req, res) => {
  console.log("route: /user/login");
  try {
    const searchedUser = await User.findOne({ email: req.fields.email });
    if (searchedUser === null) {
      res.status(401).json({ error: { message: "Unauthorized" } });
    } else {
      const password = req.fields.password;
      const newHash = SHA256(password + searchedUser.salt).toString(encBase64);
      if (newHash === searchedUser["hash"]) {
        res.json({ message: "Login authorized", searchedUser });
      } else {
        res.status(401).json({ message: "Unauthorized else", error: error });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
