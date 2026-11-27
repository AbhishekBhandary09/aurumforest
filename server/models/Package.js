const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  slug:         { type: String, required: true, unique: true },
  title:        { type: String, required: true },
  location:     { type: String, required: true },
  region:       { type: String, default: "Global" },
  tag:          { type: String, default: "Exclusive" },
  durationDays: { type: Number, required: true },
  priceGBP:     { type: Number, required: true },
  unit:         { type: String, default: "per person" },
  image:        { type: String, required: true },
  summary:      { type: String, default: "" },
  highlights:   [{ type: String }],
  itinerary:    [{ day: String, title: String, desc: String }],
  featured:     { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);
