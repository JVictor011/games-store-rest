const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/auth", userController.authentication());
router.post("/register", userController.register());
router.post("/validate-password", userController.validatePassword);

module.exports = router;
