const Story = require("../models/story");

exports.getAddStories = (req, res, next) => {
  res.render("stories/add", {
    name: req.user.displayName,
    email: req.user.email,
    image: req.user.image,
  });
};

exports.postStory = async (req, res, next) => {
  try {
    // TODO: Implement if else to check if title is not empty string
    req.body.user = req.user.id;
    // const storyTitle = req.body.title;
    // const storyStatus = req.body.status;
    // const storyBody = req.body.body;
    // const story_csrf = req.body._csrf;
    // const storyUser = req.body.user;

    // const storyObj = new Story({
    //   title: storyTitle,
    //   body: storyBody,
    //   status: storyStatus,
    //   user: storyUser,
    //   _csrf: story_csrf,
    // });

    const story = await Story.create(req.body);
    //await storyObj.save();

    console.log(story);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

exports.getShowStories = async (req, res, next) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {
      stories,
      name: req.user.displayName,
      email: req.user.email,
      image: req.user.image,
    });
    console.log(stories[0]._id);
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

exports.getShowStory = async (req, res, next) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user._id != req.user.id && story.status == "private") {
      res.render("error/404");
    } else {
      res.render("stories/show", {
        name: req.user.displayName,
        email: req.user.email,
        image: req.user.image,
        story,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};

exports.getEditStory = async (req, res, next) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return res.render("error/404");
    }

    //*makes sure only og user can edit story
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        name: req.user.displayName,
        email: req.user.email,
        image: req.user.image,
        story,
      });
      console.log(req.params.id);
    }
  } catch (err) {
    console.error(err);
  }
};

exports.putEditStory = async (req, res, next) => {
  console.log("gimme a sign");
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      //story = await Story.save(req.body);

      console.log(story);

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};

exports.deleteStory = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      await Story.findByIdAndRemove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
};
