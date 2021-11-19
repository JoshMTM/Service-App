const express = require("express");
const router = express.Router();

router.get("/signin", (req, res, next) => {
  res.render("user/signin-form.hbs");
});

router.get("/signup", (req, res, next) => {
  res.render("user/signup-form.hbs");
});

module.exports = router;
