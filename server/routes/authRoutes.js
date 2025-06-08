// Import Express framework
const express = require('express');

// Create a new Express router instance
const router = express.Router();

// Import controller functions for authentication
const { register, login } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate user and return token
// @access  Public
router.post('/login', login);

// Export the router so it can be used in the main server file
module.exports = router;
