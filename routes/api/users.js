const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
//load User model
const User = require("../../models/user");

//@route GET api/users/test
// @desc Tests users route
// @access public
router.get("/test", (req, res) => {
  res.json({ msg: "Users works" });
});

//@route GET api/users/register
// @desc Register User
// @access public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "email already exixts." });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm"
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
