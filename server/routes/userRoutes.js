// Import Express framework
const express = require('express');

// Create a new router instance for user-related routes
const router = express.Router();

// Import middleware to verify JWT authentication token
const authMiddleware = require('../middleware/authMiddleware');

// Import controller functions for user data handling
const { getUserData } = require('../controllers/authController');  // Get data of currently authenticated user
const { getUserById } = require('../controllers/userContorller');   // Get user data by user ID

// Protected route to get current authenticated user's data
// GET /api/users/me
// Requires a valid auth token (via authMiddleware)
router.get('/me', authMiddleware, getUserData);

// Protected route to get data of a user by their ID
// GET /api/users/:id
// Requires a valid auth token
router.get('/:id', authMiddleware, getUserById);

// Export the router to be included in the main application
module.exports = router;
