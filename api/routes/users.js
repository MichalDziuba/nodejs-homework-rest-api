const authMiddleware = require("../../middlewares/jwt");
const userControllers = require("../controllers/users");
const express = require("express");
const router = express.Router();

// router.use("/auth", require("./auth"));
// router.use("/list", authMiddleware, require("./list"));
router.post("/users/signup", userControllers.registerUser);
router.post("/users/login", userControllers.loginUser);
router.get("/users/logout", authMiddleware, userControllers.logoutUser);
router.get("/users/current",authMiddleware, userControllers.currentUser)
module.exports = router;
