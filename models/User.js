const mongooose = require("mongoose");

const User = mongooose.model("User", {
  email: { unique: true, required: true, type: String },
  username: { type: String },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
