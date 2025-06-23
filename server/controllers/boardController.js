// Import necessary models and utilities
const { BoardMember, User, BoardInvitation, Notification } = require('../models');
const Board = require('../models/Board');
const { Op } = require('sequelize');
const { checkBoardAccess } = require('../utils/permissions');
const Task = require('../models/Task');

// Controller to create a new board
exports.createBoard = async (req, res) => {
  const { name, description } = req.body;
  try {
    // Create a new board with current user's ID as the owner
    const board = await Board.create({
      name,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json(board); // Return created board
  } catch (err) {
    res.status(500).json({ msg: "Error creating board !!!", error: err.message });
  }
};

// Controller to invite a user to a board
exports.inviteMember = async (req, res) => {
  const { email } = req.body;
  const { boardId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the board exists and the user is the owner
    const board = await Board.findByPk(boardId);
    if (!board || board.createdBy !== userId) {
      return res.status(403).json({ message: 'Not authorized to invite members' });
    }

    // Find the user to invite by email
    const userToAdd = await User.findOne({ where: { email } });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-invitation
    if (userToAdd.id === userId) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    // Check if user is already a member
    const alreadyMember = await BoardMember.findOne({
      where: { boardId, userId: userToAdd.id },
    });
    if (alreadyMember) {
      return res.status(400).json({ message: 'User already a member' });
    }

    // Add user as a member
    await BoardMember.create({
      userId: userToAdd.id,
      boardId: board.id,
      role: 'member',
    });

    res.status(200).json({ message: 'Member invited successfully' });

  } catch (err) {
    console.error('Invite error: ', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to fetch all boards accessible to the current user (owned or shared)
exports.getBoards = async (req, res) => {
  try {
    // Find board IDs where user is a member
    const memberBoardIds = await BoardMember.findAll({
      where: { userId: req.user.id },
      attributes: ['boardId'],
    });
    const boardIds = memberBoardIds.map(m => m.boardId);

    // Find boards created by user or where user is a member
    const boards = await Board.findAll({
      where: {
        [Op.or]: [
          { createdBy: req.user.id },
          { id: { [Op.in]: boardIds } }
        ]
      },
      include: [
        {
          model: BoardMember,
          as: 'BoardMembers',
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id', 'email']
            }
          ]
        }
      ]
    });

    // Format output to include board details and member list
    const formattedBoards = boards.map(board => ({
      id: board.id,
      name: board.name,
      description: board.description,
      createdBy: board.createdBy,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      members: board.BoardMembers.map(bm => bm.User),
    }));

    res.status(200).json(formattedBoards);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching boards', error: err.message });
  }
};

// Controller to fetch a specific board by ID
exports.getBoardById = async (req, res) => {
  try {
    // Use utility function to check access and get board
    const board = await checkBoardAccess(req.params.boardId, req.user.id);
    if (!board) {
      return res.status(403).json({ msg: 'Access Denied' });
    }
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching board', error: err.message });
  }
};

// Controller to update a board
exports.updateBoard = async (req, res) => {
  const { name, description } = req.body;
  try {
    // Check if user has access
    const board = await checkBoardAccess(req.params.boardId, req.user.id);
    if (!board) return res.status(403).json({ msg: "Access Denied" });

    // Only the owner can update the board
    if (board.createdBy !== req.user.id)
      return res.status(403).json({ msg: 'Only owner can update the board' });

    // Update fields
    board.name = name || board.name;
    board.description = description || board.description;

    await board.save();
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating board', error: err.message });
  }
};

// Controller to delete a board
exports.deleteBoard = async (req, res) => {
  try {
    // Check if user has access
    const board = await checkBoardAccess(req.params.boardId, req.user.id);
    if (!board) return res.status(404).json({ msg: "Access Denied" });

    // Only the owner can delete the board
    if (board.createdBy !== req.user.id)
      return res.status(403).json({ msg: 'Only owner can delete the board' });

    // Get all members BEFORE deleting them
    const members = await BoardMember.findAll({ where: { boardId: board.id } });
    const allUserIds = members.map(m => m.userId);
    if (!allUserIds.includes(board.createdBy)) {
      allUserIds.push(board.createdBy);
    }

    // Clean up associated entities
    await Task.destroy({ where: { boardId: board.id } });
    await BoardMember.destroy({ where: { boardId: board.id } });
    await Notification.destroy({ where: { boardId: board.id } });
    await BoardInvitation.destroy({ where: { boardId: board.id } });

    // Delete the board itself
    await board.destroy();

    // Emit refresh to all users who had access
    for (const userId of allUserIds) {
      if (global.io) {
        global.io.to(`user-${userId}`).emit('notification:refresh');
      }
    }

    res.status(200).json({ msg: "Board deleted successfully !!!" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting board", error: err.message });
  }
};

// Controller for a member to leave a board
exports.leaveBoard = async (req, res) => {
  try {
    const userId = req.user.id;
    const boardId = req.params.boardId;

    // Find board
    const board = await Board.findByPk(boardId);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Owner cannot leave their own board
    if (board.createdBy === userId) {
      return res.status(400).json({ msg: 'Owner cannot leave their own board' });
    }

    // Check if user is a member
    const membership = await BoardMember.findOne({
      where: { boardId, userId },
    });
    if (!membership) {
      return res.status(404).json({ msg: 'You are not a member of this board' });
    }

    // Remove user from the board first
    await membership.destroy();
    await Notification.destroy({where: {
      userId: userId,
      boardId: boardId

    }})
    
    // Then get the updated list of members
    const members = await BoardMember.findAll({ where: { boardId: board.id } });
    const allUserIds = members.map(m => m.userId);
    if (!allUserIds.includes(board.createdBy)) {
      allUserIds.push(board.createdBy);
    }
  
    
    // Emit notification refresh to others
    for (const id of allUserIds) {
      if (global.io) {
        global.io.to(`user-${id}`).emit('notification:boardLeft', {boardId});
      }
    }
        for (const userId of allUserIds) {
      if (global.io) {
        global.io.to(`user-${userId}`).emit('notification:refresh');
      }
    }

    
    res.status(200).json({ msg: 'Left board successfully' });
  } catch (err) {
    console.error('Leave Board error', err);
    res.status(500).json({ msg: 'Internal server error', error: err.message });
  }
};
