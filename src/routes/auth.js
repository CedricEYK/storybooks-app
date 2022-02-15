const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth");
const router = express.Router();

//* Auth with Google
//* GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//* Google auth callback
//* GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.getGoogleAuth
);

//* Sign up with email & password
//* POST /auth/signup
router.post("/signup", authController.postRegister);

//* Local auth callback
//* POST /auth/signin
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: "Invalid user or password",
    successFlash: "Welcome!",
  }),
  authController.getLocalAuth
);

//* Logout user
//* /auth/logout
router.get("/logout", authController.getLogOut);

//* Reset user password
//* /auth/reset
router.post("/reset", authController.postResetPassword);

//* Reset password form
//* /reset/:token
router.get("/reset/:token", authController.getResetPasswordForm);

//* Post new password
//* /new-password
router.post("/new-password", authController.postNewPassword);

module.exports = router;
