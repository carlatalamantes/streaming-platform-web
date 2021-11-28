const express = require("express");
const router = express.Router();
const path = require("path");
const accountRouter = require("./account");
const contentRouter = require("./content");

//https://stackoverflow.com/questions/65090835/how-can-i-identify-if-user-is-admin-or-not-in-express

router.use(accountRouter);
//router.use(contentRouter);

/**
 * VIEWS
 */

//GET - Login
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/login.html"));
});

// GET - Signup
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/signup.html"), {});
});

//GET - Home
router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/home.html"));
});

//GET - Home
router.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/profile.html"));
});

module.exports = router;
