const authMiddleware = require("../../middlewares/jwt");
const userControllers = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.post("/users/signup", userControllers.registerUser);
router.post("/users/login", userControllers.loginUser);
router.get("/users/logout", authMiddleware, userControllers.logoutUser);
router.get("/users/current", authMiddleware, userControllers.currentUser);
router.get("/users/verify/:verificationToken", userControllers.verifyEmail);
router.post("/users/verify", userControllers.resendEmail)
module.exports = router;
