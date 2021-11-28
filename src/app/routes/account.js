const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");

/**
 * AUTH VALIDATIONS
 */
function isAuth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send({ error: "Access denied" });

  try {
    const verified = verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ error: "Invalid token" });
  }
}

// POST - Login
router
  .route("/user/login")
  .post(
    body("email").isEmail().withMessage("Invalid email"),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      var user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .type("text/plain")
          .send({ error: "The username does not exist" });
      }
      if (!Bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).send({ error: "The password is invalid" });
      }

      jwt.sign({ id: user._id }, "secretkey", (err, token) => {
        return res
          .json({
            token,
          })
          .status(200);
      });
    }
  );

// POST - Signup
router
  .route("/user/signup")
  .post(
    body("name").not().isEmpty().withMessage("Name cannot be empty"),
    body("lastname").not().isEmpty().withMessage("Lastname cannot be empty"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 chars minimum."),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      var exists = await User.findOne({ email: req.body.email });
      if (exists) {
        return res
          .status(422)
          .type("text/plain")
          .send({ message: "The email is already registered" });
      }

      req.body.password = Bcrypt.hashSync(req.body.password, 10);
      const user = new User(req.body);

      await user
        .save()
        .then((data) => {
          return res
            .status(201)
            .type("text/plain")
            .send({ message: "User was successfully created." });
        })
        .catch((err) => {
          res.json(err.message);
        });
    }
  );

//GET - User's profile
router.route("/user/profile").get(isAuth, async (req, res) => {
  let id = req.user.id;
  if (id !== undefined) {
    var user = await User.findOne({ _id: id });
    if (user) {
      return res
        .status(200)
        .send({ name: user.name, lastname: user.lastname, email: user.email });
    } else {
      res.type("text/plain").status(404).send(`User not found.`);
    }
  } else {
    res.status(400).type("text/plain").send("Something went wrong");
  }
});

//DELETE - User's profile
router.route("/user/profile").delete(isAuth, async (req, res) => {
  let id = req.user.id;
  if (id !== undefined) {
    await User.deleteOne({ _id: id })
      .then(() => {
        return res.status(200).send({
          message: "User was successfully deleted",
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  } else {
    res.status(400).type("text/plain").send({ error: "Something went wrong" });
  }
});

//POST - User's new password
router
  .route("/user/password")
  .post(
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 chars minimum."),
    isAuth,
    async (req, res) => {
      let id = req.user.id;
      if (id !== undefined) {
        req.body.password = Bcrypt.hashSync(req.body.password, 10);
        var user = await User.findOneAndUpdate(
          { _id: id },
          { password: req.body.password },
          { upsert: true }
        )
          .then(() => {
            return res.send({ message: "Succesfully saved" }).status(200);
          })
          .catch((err) => {
            return res.send({ error: err }).status(500);
          });
      } else {
        res
          .status(400)
          .type("text/plain")
          .send({ error: "Something went wrong" });
      }
    }
  );

module.exports = router;
