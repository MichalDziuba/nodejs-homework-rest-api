const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  return fs
    .readFile(contactsPath)
    .then((response) => {
      const data = response.toString();
      const dataJson = JSON.parse(data);
      return dataJson;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getContactById = async ({ contactId }) => {
  return fs
    .readFile(contactsPath)
    .then((response) => {
      const contacts = response.toString();
      const contactsJson = JSON.parse(contacts);
      const dataContact = contactsJson.find(
        (contact) => contact.id === contactId
      );
      if (dataContact === undefined) {
        return false;
      } else {
        return dataContact;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const removeContact = async ({ contactId }) => {
  return fs
    .readFile(contactsPath)
    .then((response) => {
      const contacts = response.toString();
      const contactsJson = JSON.parse(contacts);
      const newContactsData = contactsJson.filter(
        (contact) => contact.id !== contactId
      );
      fs.writeFile(contactsPath, JSON.stringify(newContactsData));
    })
    .catch((error) => console.log(error));
};

const addContact = async (body) => {
  return fs
    .readFile(contactsPath)
    .then((response) => {
      const contacts = response.toString();
      const contactsJson = JSON.parse(contacts);
      contactsJson.push(body);
      const newContactsArray = JSON.stringify(contactsJson);
      fs.writeFile(contactsPath, newContactsArray);
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateContact = async ({ contactId }, body) => {
  return fs.readFile(contactsPath).then((response) => {
    const contacts = response.toString();
    const contactsJson = JSON.parse(contacts);
    const contact = contactsJson.find((contact) => contact.id === contactId);
    const newContactsArray = contactsJson.filter(
      (contact) => contact.id !== contactId
    );
    newContactsArray.push(body);
    fs.writeFile(contactsPath, JSON.stringify(newContactsArray));
  });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
