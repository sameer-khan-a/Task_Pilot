// Import necessary models
const { checkDueDateNotifications } = require('../dueDateNotifier');
const { User, Board, BoardInvitation, BoardMember } = require('../models');

// Controller to send an invitation to a user to join a board
exports.sendInvitation = async (req, res) => {
  const { email } = req.body;
  const { boardId } = req.params;
  const invitedBy = req.user.id;

  try {
    // Check if the board exists and the requester is the creator
    const board = await Board.findByPk(boardId);
    if (!board || board.createdBy !== invitedBy) {
      return res.status(403).json({ message: 'Unauthorized or board not found' });
    }

    // Check if the invited user exists
    const invitedUser = await User.findOne({ where: { email } });
    if (!invitedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-invitation
    if (invitedUser.id === invitedBy) {
      return res.status(400).json({ message: 'Cannot invite yourself' });
    }

    // Check if user is already a board member
    const alreadyMember = await BoardMember.findOne({
      where: { boardId, userId: invitedUser.id },
    });
    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Check if a pending invitation already exists
    const alreadyInvited = await BoardInvitation.findOne({
      where: {
        boardId,
        invitedUserId: invitedUser.id,
        status: 'pending',
      },
    });
    if (alreadyInvited) {
      return res.status(400).json({ message: 'User is already invited' });
    }

    // Create a new invitation
    await BoardInvitation.create({
      boardId,
      invitedBy,
      invitedUserId: invitedUser.id,
    });

    res.status(200).json({ message: 'Invitation sent successfully' });

  } catch (err) {
    console.error('Send Invitation Error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller to get all pending invitations for the logged-in user
exports.getInvitations = async (req, res) => {
  try {
    // Fetch all pending invitations where current user is the invitedUser
    const invitations = await BoardInvitation.findAll({
      where: {
        invitedUserId: req.user.id,
        status: 'pending',
      },
      include: [
        {
          model: Board,
          as: 'Board',
          attributes: ['id', 'name', 'description']
        },
        {
          model: User,
          as: 'Inviter',
          attributes: ['id', 'email']
        }
      ]
    });

    res.status(200).json(invitations);

  } catch (err) {
    console.error('Fetch Invitations Error: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to accept or decline an invitation
exports.respondInvitation = async (req, res) => {
  const { invitationId } = req.params;
  const { response } = req.body; // expected to be 'accepted' or 'declined'

  try {
    // Find the invitation by ID and ensure the user is the invitee
    const invitation = await BoardInvitation.findByPk(invitationId);
    if (!invitation || invitation.invitedUserId !== req.user.id) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    // Prevent re-responding to an invitation
    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation already responded to' });
    }

    // Update the invitation status
    invitation.status = response;
    await invitation.save();

    // If accepted, add user as a board member
    if (response === 'accepted') {
      await BoardMember.create({
        boardId: invitation.boardId,
        userId: req.user.id,
        role: 'member',
      });
    }
    await checkDueDateNotifications(invitation.boardId);
    const members = await BoardMember.findAll({ where: { boardId: invitation.boardId } });
    const allUserIds = members.map(m => m.userId);

     for (const userId of allUserIds) {
      if (global.io) {
        global.io.to(`user-${userId}`).emit('notification:refresh');
      }
    }
    // If declined, delete the invitation
    if (response === 'declined') {
      await BoardInvitation.destroy({ where: { id: invitationId } });
    }

    res.status(200).json({ message: `Invitation ${response}` });

  } catch (err) {
    console.error('Respond Invitation Error: ', err);
    res.status(500).json({ message: "Internal server error" });
  }
};
