const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");

/**
 * VALIDATIONS
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

router
  .route("/admin/media")
  .post(
    body("type")
      .not()
      .isEmpty()
      .withMessage("Type cannot be empty")
      .isIn(["movie", "documentary", "tv-show"])
      .withMessage("Type value is invalid"),
    body("year")
      .isInt()
      .withMessage("Year must be a number")
      .not()
      .isEmpty()
      .withMessage("Year cannot be empty"),
    body("genre")
      .not()
      .isEmpty()
      .withMessage("Genre cannot be empty")
      .isIn([
        "action",
        "comedy",
        "documentary",
        "drama",
        "horror",
        "music",
        "romance",
        "tv-shows",
      ])
      .withMessage("Genre value is invalid"),
    body("title").not().isEmpty().withMessage("Title cannot be empty"),
    body("actors").not().isEmpty().withMessage("Actors cannot be empty"),
    body("cover").not().isEmpty().withMessage("Cover cannot be empty"),
    body("file").not().isEmpty().withMessage("File cannot be empty"),
    body("trailer").not().isEmpty().withMessage("Trailer cannot be empty"),
    body("synopsis").not().isEmpty().withMessage("Synopsis cannot be empty"),
    validateAdmin,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const content = new Movie(req.body);
      await content
        .save()
        .then((data) => {
          return res
            .status(201)
            .type("text/plain")
            .send({ message: "Content was successfully created." });
        })
        .catch((err) => {
          res.json(err.message).status(400);
        });
    }
  );

router.route("/admin/media").get(isAuth, async (req, res) => {
  await Movie.find()
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => {
      res.json(err.message).status(400);
    });
});

router.route("/admin/media/:id").get(isAuth, async (req, res) => {
  let id = req.params.id;
  await Movie.find({ _id: id })
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => {
      res.json(err.message).status(400);
    });
});

router.route("/admin/media/:id").delete(validateAdmin, async (req, res) => {
  let id = req.params.id;
  try {
    let count = await Movie.deleteOne({ _id: id });
    if (count.deletedCount == 0) {
      res.status(400).json({ error: "Delete count is 0" });
    } else {
      return res.status(200).send({
        message: "Movie was successfully deleted",
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
});

router
  .route("/admin/media/:id")
  .put(
    body("type")
      .not()
      .isEmpty()
      .withMessage("Type cannot be empty")
      .isIn(["movie", "documentary", "tv-show"])
      .withMessage("Type value is invalid"),
    body("year")
      .isInt()
      .withMessage("Year must be a number")
      .not()
      .isEmpty()
      .withMessage("Year cannot be empty"),
    body("genre")
      .not()
      .isEmpty()
      .withMessage("Genre cannot be empty")
      .isIn([
        "action",
        "comedy",
        "documentary",
        "drama",
        "horror",
        "music",
        "romance",
        "tv-shows",
      ])
      .withMessage("Genre value is invalid"),
    body("title").not().isEmpty().withMessage("Title cannot be empty"),
    body("actors").not().isEmpty().withMessage("Actors cannot be empty"),
    body("cover").not().isEmpty().withMessage("Cover cannot be empty"),
    body("file").not().isEmpty().withMessage("File cannot be empty"),
    body("trailer").not().isEmpty().withMessage("Trailer cannot be empty"),
    body("synopsis").not().isEmpty().withMessage("Synopsis cannot be empty"),
    validateAdmin,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      let id = req.params.id;
      let data = req.body;

      Movie.findOneAndUpdate({ _id: id }, data, { upsert: true })
        .then((response) => {
          return res.send({ message: "Succesfully saved" }).status(200);
        })
        .catch((error) => {
          return res.send({ error: error }).status(500);
        });
    }
  );

module.exports = router;
