const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    requireed: true,
  },
  email: {
    type: String,
    requireed: true,
  },
  password: {
    type: String,
    requireed: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  displayName: {
    type: String,
    requireed: true,
  },
  firstName: {
    type: String,
    requireed: true,
  },
  lastName: {
    type: String,
    requireed: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
