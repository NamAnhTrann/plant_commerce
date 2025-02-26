const express = require("express");
const router = express.Router();
const contactController = require("../controller/contactUsController");

router.post("/add/contact/api", contactController.addContact);
router.get("/list/contact", contactController.listContactId);

module.exports = router;
