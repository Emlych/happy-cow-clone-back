const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();

//import model
const User = require("../models/User");

//User connected (token exists)
const isAuthenticated = async (req, res, next) => {
  const tokenRegistered = req.headers.authorization;
  //   const tokenRegistered = req.query.userToken;
  console.log("token registered ==>", tokenRegistered);
  if (tokenRegistered) {
    console.log("here is the registered token ==>", tokenRegistered);
    const isTokenValid = await User.findOne({
      token: tokenRegistered.replace("Bearer ", ""),
    });
    if (isTokenValid) {
      console.log("Valid tokenr");
      next();
    } else {
      res.status(400).json("Unauthorized");
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

//Create new favorite or delete it
router.post("/favorite/handle", isAuthenticated, async (req, res) => {
  console.log("route: /favorite/handle");
  const tokenUser = req.headers.authorization.replace("Bearer ", "");
  const targetUser = await User.findOne({ token: tokenUser });
  const targetUserFavorites = targetUser.favorite;
  try {
    //if already exist, delete favorite
    if (targetUserFavorites.includes(req.fields.placeId)) {
      targetUserFavorites.splice(
        targetUserFavorites.indexOf(req.fields.placeId),
        1
      );
      await targetUser.save();
      res.json({ message: "Favorite deleted", targetUser });
    }
    //if not, add favorite
    else {
      targetUserFavorites.push(req.fields.placeId);
      await targetUser.save();
      res.json({ message: "New favorite registered", targetUser });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

//Read all favorites for a given user
router.get("/favorites", isAuthenticated, async (req, res) => {
  console.log("route: /favorites");
  const tokenUser = req.headers.authorization.replace("Bearer ", "");
  try {
    const targetUser = await User.findOne({ token: tokenUser });
    console.log("target user:", targetUser);
    const targetUserFavorites = targetUser.favorite;
    console.log("target user favorites : ", targetUserFavorites);
    res.json({
      message: "The favorites have been loaded",
      favorites: targetUserFavorites,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Delete favorite
// router.delete("/favorite/delete", isAuthenticated, async (req, res) => {
//   console.log("route: /favorite/delete");
//   const tokenUser = req.headers.authorization.replace("Bearer ", "");
//   try {
//     const targetUser = await User.findOne({ token: tokenUser });
//     const targetUserFavorites = targetUser.favorite;
//     if (!targetUserFavorites.includes(req.fields.placeId)) {
//       res.json({ message: "this favorite would be added" });
//     } else {
//       targetUserFavorites.splice(
//         targetUserFavorites.indexOf(req.fields.placeId),
//         1
//       );
//       await targetUser.save();
//       res.json({ message: "Favorite deleted", targetUser });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error });
//   }
// });

module.exports = router;
