const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  type: {
    type: [
      {
        type: String,
        enum: ["movie", "documentary", "tv-show"],
      },
    ],
    required: true,
    lowercase: true,
  },
  year: { type: Number, required: true },
  genre: {
    type: [
      {
        type: String,
        enum: [
          "action",
          "comedy",
          "documentary",
          "drama",
          "horror",
          "music",
          "romance",
          "tv-shows",
        ],
      },
    ],
    required: true,
  },
  title: { type: String, required: true, trim: true },
  actors: { type: String, required: true },
  cover: { type: String, required: true, trim: true },
  file: { type: String, required: true, trim: true },
  trailer: { type: String, required: true, trim: true },
  synopsis: { type: String, required: true },
});

module.exports = mongoose.model("Movie", movieSchema);
