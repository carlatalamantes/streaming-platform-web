"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { url } = require("./config/database");
const router = require("./app/routes/routes");
const bodyParser = require("body-parser");

/**
 * CONNECTING TO DATABASE
 */
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to DB");
  }
);

/**
 * SETTINGS
 */

const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Netflix clone listening on port ${port}! `);
});

/**
 * MIDDLEWARES
 */
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * ROUTES
 */
app.use(router);

/**
 * STATIC FILES
 */
app.use(express.static(path.join(__dirname, "public")));
