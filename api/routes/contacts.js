const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contacts");
router.get("/contacts", contactController.getAllContacts);
router.post("/contacts", contactController.postContact);
router.get("/contacts/:id", contactController.getContactById);
router.delete("/contacts/:id", contactController.deleteContact);
router.put("/contacts/:id", contactController.putContact);
router.patch("/contacts:id/favorite", contactController.patchContactFavorite);

module.exports = router;
