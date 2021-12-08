const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGest } = require("../middlewares/middleAuth");
const Story = require("../models/Story");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const stories = await Story.find();
  const users = await User.find({});
  if (req.isAuthenticated()) {
    res.render("home", {
      user: req.user,
      userAuth: true,
      stories,
      users,
    });
  } else {
    res.render("home", { stories, user: false, users, userAuth: false });
  }
});

router.get("/login", ensureGest, (req, res) => {
  res.render("login", { layout: "layout2" });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  const userStories = await Story.find({ storyUserId: req.user.googleId });
  if (userStories.length == 0) {
    res.render("dashboard", {
      user: req.user,
      userAuth: true,
      userStories: false,
    });
  } else {
    res.render("dashboard", {
      user: req.user,
      userAuth: true,
      userStories,
    });
  }
});
router.get("/dashboard/:id", async (req, res) => {
  const user = await User.findOne({ googleId: req.params.id });
  const userStories = await Story.find({ storyUserId: user.googleId });
  res.render("dashboard", { user, userStories, userAuth: true });
});

module.exports = router;
