const express = require('express');

// Create a new router instance from Express
const router = express.Router();

// Import controller functions to handle board member related operations
const {
    addMember,    // Function to add a member to a board
    removeMember, // Function to remove a member from a board
    getMembers    // Function to get all members of a board
} = require('../controllers/boardMemberController');

// Import authentication middleware to protect routes
const authMiddleware = require('../middleware/authMiddleware');

// Route to add a member to a board (POST request)
// Protected route - requires user to be authenticated
router.post('/add', authMiddleware, addMember);

// Route to remove a specific member from a specific board (DELETE request)
// Uses URL parameters for boardId and userId
// Protected route - requires user to be authenticated
router.delete('/:boardId/members/:userId', authMiddleware, removeMember);

// Route to get all members of a specific board (GET request)
// Uses URL parameter for boardId
// Protected route - requires user to be authenticated
router.get('/:boardId', authMiddleware, getMembers);

// Export the router to be used in the main app
module.exports = router;
