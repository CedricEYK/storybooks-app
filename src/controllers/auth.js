const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

//* Setup nodemailer transport for sendgrid
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getGoogleAuth = (req, res, next) => {
  res.redirect("/dashboard");
};

exports.getLocalAuth = (req, res, next) => {
  res.redirect("/dashboard");
};

exports.postRegister = async (req, res, next) => {
  //* retrieve form data from req.body
  const email = req.body.email;
  const password = req.body.password;

  try {
    //* check if given user email already exists in db
    let user = await User.findOne({ email: email });
    if (user) {
      req.flash("error", "Email already registered. Choose another.");
      res.redirect("/");
    } else {
      //* or create the new user
      //* generate salt and hash
      const hashedPassword = await bcrypt.hash(password, 10);
      //* create user object add hashedpassword
      const newUser = {
        email: email,
        password: hashedPassword,
        image: "../img/user.png",
      };
      //* create the user and save it to db
      user = User.create(newUser);
      res.redirect("/");
      //* sending an email to mail addres
      return transporter.sendMail({
        to: email,
        from: "D3v4dm1n@mail.com",
        subject: "SignUp succesfull",
        html: "<h1>Thanks for signing up</h1>",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getLogOut = (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
};

exports.postResetPassword = async (req, res, next) => {
  //* Define the resetPassword token
  let token;
  //* create token value with node crypto library
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    //* assign buffer value to token var
    token = buffer.toString("hex");
  });
  try {
    //* compare form email to user email in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "Account not found");
      res.redirect("/");
    } else {
      //* if user email match assign values
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      //* and save in the databse
      user.save();
      res.redirect("/");
    }
    //* send email to user with a link to the reset password form with token as a param
    return transporter.sendMail({
      to: req.body.email,
      from: "D3v4dm1n@mail.com",
      subject: "Reset your password",
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/auth/reset/${token}">link</a></p>
      `,
    });
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
};

exports.getResetPasswordForm = async (req, res, next) => {
  //* capture token from the req params
  const token = req.params.token;
  try {
    //* compare user with current reset token and expDate
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    res.render("resetpwd/resetPassword", {
      userId: user._id,
      resetToken: user.resetToken,
      name: user.name,
      email: user.email,
      image: user.image,
    });

    console.log(user);
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const resetToken = req.body.resetToken;

  try {
    //* compare user with current reset token and expDate
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = newHashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    console.log(newPassword);
    user.save();

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
