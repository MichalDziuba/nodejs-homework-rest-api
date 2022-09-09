const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const router = express.Router();
const uuid = require("uuid");
const id = uuid.v1();
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().min(7).max(50).required(),
  phone: Joi.string().min(6).max(12).required(),
});
const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  email: Joi.string().email().min(7).max(50),
  phone: Joi.string().min(6).max(12),
});

router.get("/", async (req, res, next) => {
  res.status(200).json(await listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params;
  const contactId = await getContactById(id);
  if (!contactId) {
    res.status(404);
    next();
  } else {
    res.status(200).json(contactId);
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const contact = {
    id: id,
    name: name,
    email: email,
    phone: phone,
  };
  const result = contactSchema.validate(req.body);

  if (result.error) {
    res.status(400).json({ message: "missing required name field" });
    next();
  } else {
    addContact(contact);
    res.status(201).json(contact);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    res.status(404);
    next();
  } else {
    res.status(200).json(await removeContact(id));
  }
});

router.put("/:contactId", async (req, res, next) => {
  const id = req.params;
  const requestData = req.body;
  const result = updateContactSchema.validate(req.body);
  const contact = await getContactById(id);
  const newContactData = { ...contact, ...requestData };

  if (Object.keys(result.value).length === 0 || result.error) {
    res.status(400).json({ message: "missing or wrong fields" });
    next();
  }
  if (!contact) {
    res.status(404).json({ message: "Not found" });
    console.log("not found");
    next();
  }

  if (contact) {
    res.status(200).json(await updateContact(id, newContactData));
    next();
  }
});

module.exports = router;
