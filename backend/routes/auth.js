const { login, register } = require("../controllers/authController");

const express = require("express");
// import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

module.exports = router;
