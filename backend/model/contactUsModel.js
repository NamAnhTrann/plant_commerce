const mongoose = require("mongoose");

let contactUsSchema = new mongoose.Schema({
  contactFirstName: {
    type: String,
    required: true,
  },
  contactLastName: {
    type: String,
    required: true,
  },
  contactPhoneNumber: {
    type: Number,
    default: 0,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactMessage: {
    type: String,
    required: false,
  },
  contactQuery: {
    type: String,
    enum: ["General_Inquiry", "Technical_Support", "Refund"],
  },
});

module.exports = mongoose.model("ContactUs", contactUsSchema);
