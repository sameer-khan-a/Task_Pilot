// Import required models
const Board = require('../models/Board');
const User = require('../models/User');
const BoardMember = require('../models/BoardMember');
const Notification = require('../models/Notification');

// Controller to add a user to a board (used internally or by admins)
exports.addMember = async (req, res) => {
    const { boardId, userId } = req.params;

    try {
        // Check if the board exists
        const board = await Board.findByPk(boardId);
        if (!board) return res.status(404).json({ msg: 'Board not found' });

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Check if the user is already a member of the board
        const existing = await BoardMember.findOne({ where: { boardId, userId } });
        if (existing) return res.status(400).json({ msg: "User is already a board member" });

        // Add user to the board as a member
        const boardMember = await BoardMember.create({ boardId, userId });

        // Return success response
        res.status(201).json(boardMember);
    } catch (err) {
        // Handle unexpected errors
        res.status(500).json({ msg: "Error adding board member", error: err.message });
    }
};

// Controller to remove a user from a board
exports.removeMember = async (req, res) => {
    const { boardId, userId } = req.params;
    const requesterId = req.user.id;

    try {
        // Find the board
        const board = await Board.findByPk(boardId);
        if (!board) return res.status(404).json({ msg: 'Board not found' });

        // Ensure only the board owner can remove members
        if (board.createdBy !== requesterId) {
            return res.status(403).json({ msg: 'Only the board owner can remove members' });
        }

        // Prevent owner from removing themselves
        if (userId === requesterId) {
            return res.status(400).json({ msg: 'Owner cannot remove themselves' });
        }
           await Task.destroy({where: {
      boardId,
      userId

    }})
        // Attempt to remove the member from the board
        const deleted = await BoardMember.destroy({ where: { boardId, userId } });
        // If no rows deleted, user wasn't a member
        if (!deleted) return res.status(404).json({ msg: 'Member not found in board' });
           await Notification.destroy({where: {
      userId: userId,
      boardId: boardId

    }})
        if (global.io) {
        global.io.to(`user-${userId}`).emit('notification:boardLeft', {boardId});
        global.io.to(`user-${userId}`).emit('notification:refresh', {boardId});
      }
        // Success response
        res.status(200).json({ msg: 'Member removed successfully' });

    } catch (err) {
        // Handle errors
        res.status(500).json({ msg: "Error removing board member", error: err.message });
    }
};

// Controller to get all members of a board
exports.getMembers = async (req, res) => {
    const { boardId } = req.params;

    try {
        // Check if board exists
        const board = await Board.findByPk(boardId);
        if (!board) return res.status(404).json({ msg: "Board not found" });

        // Get members of the board with only id and email
        const members = await board.getMembers({
            attributes: ['id', 'email'],             // Only return essential user info
            joinTableAttributes: [],                 // Don't return join table info
        });

        // Send members as response
        res.status(200).json(members);
    } catch (err) {
        // Handle errors
        res.status(500).json({ msg: 'Error fetching board members', error: err.message });
    }
};
