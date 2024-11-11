const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  country: { type: String, required: true },

  state: { type: String, required: true },

  city: { type: String, required: true },

  price: {
    type: Number,
    required: true,
  },
  availableDates: {
    type: [Date],
    required: true,
  },

  images: [String],
  
  host: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
});

const Experience = mongoose.model("Experience", experienceSchema);
module.exports = Experience;
