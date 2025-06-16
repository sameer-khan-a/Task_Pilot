const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/:boardId/invite', authenticate, invitationController.sendInvitation);
router.get('/my', authenticate, invitationController.getInvitations);
router.post('/:invitationId/respond', authenticate, invitationController.respondInvitation);

module.exports = router;