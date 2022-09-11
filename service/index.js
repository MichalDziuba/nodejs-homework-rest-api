const Contact = require("./schemas/contacts");

const getAllContacts = () => Contact.find({});
const createContact = (data) => Contact.create(data);
const getContactById = (id) => Contact.findOne({ _id: id });
const deleteContact = (id) => Contact.findByIdAndRemove(id);
const updateContact = (id, data) =>
  Contact.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: data,
    },
    {
      new: true,
      strict: "throw",
      runValidators: true,
    }
  );
const updateContactFavorite = (id, data) =>
  Contact.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      $set: data,
    },
    {
      new: true,
      strict: "throw",
      runValidators: true,
    }
  );

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateContactFavorite,
};
