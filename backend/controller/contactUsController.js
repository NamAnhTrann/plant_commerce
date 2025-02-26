const Contact = require("../model/contactUsModel");

module.exports = {
  addContact: async function (req, res) {
    try {
      if (!req.body.contactFirstName || !req.body.contactEmail) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newContact = new Contact({ ...req.body });

      await newContact.save();
      return res.status(201).json(newContact);
    } catch (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },

  listContactId: async function (req, res) {
    const contactId = req.params.id;
    try {
      const contact = await Contact.findById(contactId);
      return res.status(201).json(contact);
    } catch (err) {
      return res.status(404).json({ message: "error" });
    }
  },
};
