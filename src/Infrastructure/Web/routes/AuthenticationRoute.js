const express = require('express');
const router = express.Router();
const authController = require('../../../Adapter/Controller/AuthenticationController');

// Login
router.post('/login', authController.login);

// Register
router.post('/register', authController.register);

// Logout
router.post('/logout', authController.logout);

module.exports = router;