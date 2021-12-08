const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGest } = require("../middlewares/middleAuth");
const Story = require("../models/Story");
const User = require("../models/User");

//routes
//creating dashboard
router.get("/createstory", ensureAuth, (req, res) => {
  res.render("createstory", { user: req.user, userAuth: true, err: "" });
});

//create
router.post("/createstory", ensureAuth, async (req, res) => {
  try {
    const { storyTitle, storyDescription, uploadType } = req.body;
    const { googleId, displayName, image } = req.user;
    const newStory = new Story({
      storyTitle,
      uploadType,
      storyDescription,
      storyUserId: googleId,
      storyUserName: displayName,
      storyUserImage: image,
    });
    await Story.create(newStory);
    res.redirect("/createstory");
  } catch (err) {
    console.assert(err, err);
    res.status(502).render("errors/error502", { layout: "layout2" });
  }
});

//update
router.post("/story/update/:id", ensureAuth, async (req, res) => {
  const story = await Story.updateOne(
    { _id: req.params.id },
    {
      storyTitle: req.body.storyTitle,
      uploadType: req.body.uploadType,
      storyDescription: req.body.storyDescription,
    }
  );
  res.redirect("/dashboard");
});

router.get("/story/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id });
  res.render("edit", { user: req.user, story });
});

//delete
router.get("/story/delete/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOneAndRemove({ _id: req.params.id });
  res.redirect("/dashboard");
});

//view one stories
router.get("/stories/view/:id#like", async (req, res) => {
  console.log("working");
});
router.get("/stories/view/:id", async (req, res) => {
  await Story.updateOne({ _id: req.params.id }, { $inc: { views: 1 } });
  const story = await Story.findOne({ _id: req.params.id });
  await User.updateOne(
    { googleId: story.storyUserId },
    { $inc: { totalViews: 1 } }
  );
  if (req.isAuthenticated()) {
    res.render("storyview", {
      user: req.user,
      story,
      userAuth: true,
    });
  } else {
    res.render("storyview", {
      user: req.user,
      storyUser,
      story,
      userAuth: false,
    });
  }
});

//view all stories
router.get("/stories", async (req, res) => {
  const userStories = await Story.find();
  if (req.isAuthenticated()) {
    res.render("stories", {
      user: req.user,
      userAuth: true,
      userStories,
    });
  } else {
    res.render("stories", {
      user: req.user,
      userAuth: false,
      userStories,
    });
  }
});

module.exports = router;
