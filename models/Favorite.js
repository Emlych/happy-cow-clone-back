const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  placeId: { unique: true, required: true, type: Number },
  name: { required: true, type: String },
  address: { type: String },
  thumbnail: { type: String },
  rating: { type: Number },
  userId: { required: true, type: String },
});

module.exports = Favorite;
