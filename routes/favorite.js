const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();

//import model
const Favorite = require("../models/Favorite");
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
      //   token: tokenRegistered,
    });
    if (isTokenValid) {
      console.log("Valid token, authorized to create an offer");
      next();
    } else {
      res.status(400).json("Unauthorized");
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

//Create new favorite
router.post("/favorite/add", isAuthenticated, async (req, res) => {
  console.log("route: /favorite/add");
  console.log("query ==>", req.query);
  const tokenUser = req.headers.authorization.replace("Bearer ", "");
  //   const tokenUser = req.query.userToken;
  const targetUser = await User.findOne({ token: tokenUser });
  const targetUserId = targetUser._id;
  try {
    //check if favorite id does already exist
    const favoriteId = await Favorite.findOne({ placeId: req.fields.placeId });
    if (favoriteId) {
      console.log("this favorite is already registered");
      res.json({ message: "this favorite already exists" });
    } else {
      //if not, create a new favorite
      const newFavorite = new Favorite({
        placeId: req.fields.placeId,
        name: req.fields.name,
        address: req.fields.address,
        thumbnail: req.fields.thumbnail,
        rating: req.fields.rating,
        userId: targetUserId,
      });
      await newFavorite.save();
      res.json({ message: "New favorite registered", newFavorite });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

//Read all favorites for a given user
router.get("/favorites", isAuthenticated, async (req, res) => {
  console.log("route: /favorites");
  const tokenUser = req.headers.authorization.replace("Bearer ", "");
  //   const tokenUser = req.query.userToken;
  const targetUser = await User.findOne({ token: tokenUser });
  const targetUserId = targetUser._id;
  const favorites = await Favorite.find({ userId: targetUserId });
  res.json({ message: "The favorites have been loaded", favorites: favorites });
});

//Delete favorite
router.delete("/favorite/delete", isAuthenticated, async (req, res) => {
  console.log("route: /favorite/delete");
  try {
    const favorite = await Favorite.findOne({ placeId: req.fields.placeId });
    console.log("here is my favorite ==>", favorite);
    if (!favorite) {
      res.status(400).json({ error: { message: "No item to favor" } });
    } else {
      await Favorite.findByIdAndDelete(favorite._id);
      res.json({ message: "Favorite restaurant deleted" });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = router;
