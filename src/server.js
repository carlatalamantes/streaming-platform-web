"use strict";

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { url } = require("./config/database");
const router = require("./app/routes/routes");
const bodyParser = require("body-parser");

/**
 * CONNECTING TO DATABASE
 */
mongoose.connect(
  "mongodb+srv://admin:justinbieber@clusternetflixclone.enidg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));

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
