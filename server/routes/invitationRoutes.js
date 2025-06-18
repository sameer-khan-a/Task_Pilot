// Import necessary modules
const express = require('express');
const router = express.Router();

// Import the invitation controller and authentication middleware
const invitationController = require('../controllers/invitationController');
const authMiddleware = require('../middleware/authMiddleware.js');

// Route to send an invitation to a user for a specific board
// Protected by authentication middleware
router.post('/:boardId/invite', authMiddleware, invitationController.sendInvitation);

// Route to get all invitations for the currently authenticated user
router.get('/my', authMiddleware, invitationController.getInvitations);

// Route to respond (accept/reject) to a specific invitation
router.post('/:invitationId/respond', authMiddleware, invitationController.respondInvitation);

// Export the router to be used in the main app
module.exports = router;
