const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/signin", (req, res, next) => {
  res.render("user/signin-form.hbs");
});

router.get("/signup", (req, res, next) => {
  res.render("user/signup-form.hbs");
});

router.post("/signup", (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  if (email == "" || firstName == "" || lastName == "" || password == "") {
    res.render("user/signup-form", {
      error: "Please enter all information to create an account",
    });
    return;
  }

  let passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if (!passwordRegEx.test(password)) {
    res.render("user/signup-form.hbs", {
      error:
        "Please enter a valid password: Minimum eight characters, at least one letter, one number and one upperCase and lowercase",
    });
    return;
  }

  User.create({ firstName, lastName, email, password: hash })
    .then(() => {
      res.render("user/user-profile.hbs");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/signin", (req, res, next) => {
  let { email, password } = req.body;
  User.find({ email })
    .then((emailResponse) => {
      console.log(emailResponse);
      if (emailResponse.length) {
        let userObj = emailResponse[0];
        let isMatching = bcrypt.compareSync(password, userObj.password);

        if (isMatching) {
          req.session.myProperty = userObj;
          res.render("user/user-profile");
        } else {
          res.render("user/signin-form.hbs", {
            error: "Password incorrect, Please try again",
          });
          return;
        }
      } else {
        res.render("user/signin-form.hbs", { error: "user not found" });
        return;
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/signin");
});

module.exports = router;
