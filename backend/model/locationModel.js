const mongoose = require("mongoose");

let locationSchema = new mongoose.Schema({
  locationStreet: {
    type: String,
    required: false,
  },
  locationCity: {
    type: String,
  },
  locationState: {
    type: String,
  },
  locationCountry: {
    type: String,
  },
  locationPostCode: {
    type: Number,
  },
});

module.exports = mongoose.model("Location", locationSchema);
