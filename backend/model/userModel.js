const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  userFirebaseUid: {
    type: String,
    required: false,
  },
  userEmail: {
    type: String,
    required: false,
  },
  userFirstName: {
    type: String,
    default: "none",
    required: false,
  },
  userLastName: {
    type: String,
    default: "none",
    required: false,
  },
  userPhoneNumber: {
    type: Number,
    default: 0,
  },
  userCreatedAt: {
    type: Date,
    default: Date.now(),
  },
  userLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
