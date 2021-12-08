const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  storyTitle: {
    type: String,
    required: true,
  },
  uploadType: {
    type: String,
    required: true,
  },
  storyDescription: {
    type: String,
    required: true,
  },
  storyUserId: {
    type: String,
    required: true,
  },
  storyUserName: {
    type: String,
    required: true,
  },
  storyUserImage: {
    type: String,
    required: true,
  },

  likes: Number, 
  views: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Story", StorySchema);
