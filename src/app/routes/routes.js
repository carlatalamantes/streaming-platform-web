const express = require("express");
const router = express.Router();
const path = require("path");
const accountRouter = require("./account");
const contentRouter = require("./content");
const reviewRouter = require("./reviews");

//https://stackoverflow.com/questions/65090835/how-can-i-identify-if-user-is-admin-or-not-in-express

router.use(accountRouter);
router.use(contentRouter);
router.use(reviewRouter);

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

//GET - Movie Detail
router.get("/movie-detail/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/movie-detail.html"));
});

//GET - Profile
router.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/profile.html"));
});

//GET - Admin login
router.get("/adminpanel/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/login_admin.html"));
});

//GET - Admin Home
router.get("/adminpanel/media", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/home_admin.html"));
});

//GET - Admin Users
router.get("/adminpanel/users", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/views/users_admin.html"));
});

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

module.exports = router;
