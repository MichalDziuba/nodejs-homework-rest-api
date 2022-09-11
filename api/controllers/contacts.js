const e = require("express");
const service = require("../../service/contacts");
const { validationSchema } = require("../../service/schemas/validation");
const { updateContactSchema } = require("../../service/schemas/validation");
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await service.getAllContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await service.getContactById(id);

    if (!contact) {
      res.status(404);
      next();
    } else {
      res.status(200).json(contact);
    }
  } catch (error) {
    next(e);
  }
};

const postContact = async (req, res, next) => {
  const data = req.body;
  const validationResult = validationSchema.validate(data);
  console.log(validationResult)
  if (validationResult.error) {
    res.status(400).json({ message: "missing required name field" });
    next();
  } else {
    try {
      const result = await service.createContact(data);
      console.log(result)
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
};
const putContact = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  console.log(data);
  const validationResult = updateContactSchema.validate(data);
  if (
    Object.keys(validationResult.value).length === 0 ||
    validationResult.error
  ) {
    res.status(400).json({ message: "missing or wrong fields" });
    next();
  } else {
    try {
      const result = await service.updateContact(id, data);
      console.log(id,data)
      if (result) {
        res.status(200).json(result);
      } else {
        next();
      }
    } catch (e) {
      next(e);
    }
  }
};
const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contactToDelete = await service.deleteContact(id);
    if (!contactToDelete) {
      res.status(404);
      next();
    } else {
      res.status(200).json({ message: "contact deleted" });
    }
  } catch (error) {
    next(e);
  }
};

const patchContactFavorite = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  console.log(favorite)
  try {
    const result = await service.updateContactFavorite(id, { favorite });
    if (result) {
      res.json(result);
    } else {
      next();
    }
  } catch (error) {
    next(e);
  }
};
module.exports = {
  getAllContacts,
  postContact,
  getContactById,
  deleteContact,
  putContact,
  patchContactFavorite,
};
