const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const { body, validationResult } = require("express-validator");
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

router
  .route("/review")
  .post(
    body("name").not().isEmpty().withMessage("Name cannot be empty"),
    body("userId").not().isEmpty().withMessage("User id cannot be empty"),
    body("movieId").not().isEmpty().withMessage("Movie id cannot be empty"),
    body("review").not().isEmpty().withMessage("Review cannot be empty"),
    isAuth,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      var review = new Review(req.body);
      await review
        .save()
        .then((data) => {
          return res
            .status(201)
            .type("text/plain")
            .send({ message: "Review was successfully created." });
        })
        .catch((err) => {
          res.json(err.message).status(401);
        });
    }
  );

router.route("/review/:id").get(isAuth, async (req, res) => {
  let id = req.params.id;
  await Review.find({ movieId: id })
    .then((response) => {
      res.send(response).status(200);
    })
    .catch((err) => {
      res.json(err.message).status(400);
    });
});

module.exports = router;
