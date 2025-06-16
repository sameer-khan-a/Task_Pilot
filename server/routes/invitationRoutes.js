const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const {authenticate} = require('../middleware/auth');

router.post('/:boardId/invite', authenticate, invitationController.sendInvitation);
router.get('/', authenticate, invitationController.getInvitations);
router.post('/:invitationId/respond', authenticate, invitationController.respondInvitation);

module.exports = router;