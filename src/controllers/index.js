const Story = require("../models/story");

exports.getIndex = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("login", {
    layout: "login",
    errorMessage: message,
  });
};

exports.getDashoard = async (req, res, next) => {
  try {
    // const stories = await Story.find({ user: req.user.id })
    const stories = await Story.find({}).populate("user").lean();
    res.render("dashboard", {
      name: req.user.displayName,
      email: req.user.email,
      image: req.user.image,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
};
