const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  movieId: { type: String, required: true },
  review: { type: String, required: true },
});

module.exports = mongoose.model("Review", reviewSchema);
