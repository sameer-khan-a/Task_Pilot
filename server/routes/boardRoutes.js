// Import Express framework
const express = require('express');
// Import database connection pool (though unused here, probably used in controllers)
const pool = require('../config/db');

// Create a new Express router instance
const router = express.Router();

// Import controller functions that handle board-related logic
const {
  createBoard,    // Create a new board
  getBoards,      // Retrieve all boards for the logged-in user
  updateBoard,    // Update details of a specific board
  deleteBoard,    // Delete a board by ID
  leaveBoard,     // Leave a board (for non-owners)
  getBoardById,   // Get details of a single board by ID
  inviteMember    // Invite a user to join a board
} = require('../controllers/boardController');

// Import middleware to verify JWT authentication and protect routes
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a new board
// POST /api/boards/create
// Protected: user must be authenticated
router.post('/create', authMiddleware, createBoard);

// Route for a user to leave a board they are a member of (not owner)
// POST /api/boards/:boardId/leave
// Protected route
router.post('/:boardId/leave', authMiddleware, leaveBoard);

// Route to get all boards owned or shared with the authenticated user
// GET /api/boards/
// Protected route
router.get('/', authMiddleware, getBoards);

// Route to update a specific board by its ID
// PUT /api/boards/:boardId
// Protected route
router.put('/:boardId', authMiddleware, updateBoard);

// Route to get details of a single board by its ID
// GET /api/boards/:boardId
// Protected route
router.get('/:boardId', authMiddleware, getBoardById);

// Route to delete a specific board by its ID
// DELETE /api/boards/:boardId
// Protected route - only owner can delete
router.delete('/:boardId', authMiddleware, deleteBoard);

// Route to invite a user to a board by board ID
// POST /api/boards/:boardId/invite
// Protected route
router.post('/:boardId/invite', authMiddleware, inviteMember);

// Export the router to be used in the main Express app
module.exports = router;
