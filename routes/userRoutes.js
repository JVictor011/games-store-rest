const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/auth", userController.authentication());

module.exports = router;
