const express = require("express");
const indexControllers = require("../controllers/index");
const router = express.Router();

//* authenticating routes
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//* login/Landing page
//* GET
router.get("/", ensureGuest, indexControllers.getIndex);

//* /dashboard
//* GET
router.get("/dashboard", ensureAuth, indexControllers.getDashoard);

module.exports = router;
