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

  if (verify(token, "secretkey")) {
    next();
  } else {
    res.status(400).send({ error: "Invalid token" });
  }
}

function validateAdmin(req, res, next) {
  const token = req.header("auth-token");
  var decoded = jwt.decode(token);

  if (decoded.role.includes("admin")) {
    next();
  } else {
    res.status(403).type("text/plain").send("Unauthorized");
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

      jwt.sign({ id: user._id, role: user.role }, "secretkey", (err, token) => {
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
  const token = req.header("auth-token");
  var decoded = jwt.decode(token);
  let id = decoded.id;
  if (id !== undefined) {
    var user = await User.findOne({ _id: id });
    if (user) {
      return res.status(200).send({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        history: user.history,
      });
    } else {
      res.type("text/plain").status(404).send(`User not found.`);
    }
  } else {
    res.status(400).type("text/plain").send("Something went wrong");
  }
});

//DELETE - User's profile
router.route("/user/profile").delete(isAuth, async (req, res) => {
  const token = req.header("auth-token");
  var decoded = jwt.decode(token);
  let id = decoded.id;
  try {
    let count = await User.deleteOne({ _id: id });
    if (count.deletedCount == 0) {
      res.status(400).json({ error: "Delete count is 0" });
    } else {
      return res.status(200).send({
        message: "User was successfully deleted",
      });
    }
  } catch (error) {
    res.status(400).json("Something went wrong");
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
      const token = req.header("auth-token");
      var decoded = jwt.decode(token);
      let id = decoded.id;
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

router.route("/user/users").get(validateAdmin, async (req, res) => {
  await User.find()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => {
      res.json(err.message).status(400);
    });
});

router.route("/user/:id").delete(validateAdmin, async (req, res) => {
  const token = req.header("auth-token");
  var decoded = jwt.decode(token);
  let loggedid = decoded.id;
  let id = req.params.id;

  try {
    if (loggedid == id) {
      res.status(400).json({ error: "You cannot delete your own account" });
    } else {
      let count = await User.deleteOne({ _id: id });
      if (count.deletedCount == 0) {
        res.status(400).json({ error: "Delete count is 0" });
      } else {
        return res.status(200).send({
          message: "User was successfully deleted",
        });
      }
    }
  } catch (error) {
    res.status(400).json("Something went wrong");
  }
});

router.route("/user/profile").put(isAuth, async (req, res) => {
  const token = req.header("auth-token");
  var decoded = jwt.decode(token);
  let id = decoded.id;
  let data = req.body;

  User.findOneAndUpdate(
    { _id: id, "user.history": { $ne: data.history } },
    { $push: { history: data.history } },
    { upsert: true }
  )
    .then((response) => {
      return res
        .send({ message: "Movie succesfully added to history." })
        .status(200);
    })
    .catch((error) => {
      return res.send({ error: error }).status(500);
    });
});

module.exports = router;
