const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/:boardId/invite', authMiddleware, invitationController.sendInvitation);
router.get('/my', authMiddleware, invitationController.getInvitations);
router.post('/:invitationId/respond', authMiddleware, invitationController.respondInvitation);

module.exports = router;