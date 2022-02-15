const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    requireed: true,
    trim: true,
  },
  body: {
    type: String,
    requireed: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // _csrf: {
  //   type: String,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Story", StorySchema);
