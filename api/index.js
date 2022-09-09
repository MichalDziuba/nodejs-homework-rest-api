const express = require("express");
const router = express.Router();
const contactController = require("./controllers/contacts");
router.get("/", contactController.getAllContacts);
router.post("/", contactController.postContact);
router.get("/:id", contactController.getContactById);
router.delete("/:id", contactController.deleteContact);
router.put("/:id", contactController.putContact);
router.patch("/:id/favorite", contactController.patchContactFavorite);

module.exports = router;
