const Board = require('../models/Board');
const BoardMember = require('../models/BoardMember');

// Function to check if a user has access to a specific board
// Returns the board object if access is granted, otherwise null
exports.checkBoardAccess = async (boardId, userId) => {
    // Find the board by primary key (boardId)
    const board = await Board.findByPk(boardId);
    // If board does not exist, return null (no access)
    if (!board) return null;

    // If the user is the creator/owner of the board, grant access
    if (board.createdBy === userId) return board;

    // Otherwise, check if the user is a member of the board
    const member = await BoardMember.findOne({
        where: { boardId, userId }
    });

    // Return the board if user is a member, else null (no access)
    return member ? board : null;
};

// Function to check if a user has access to a specific board
// Returns true if access is granted, otherwise false
exports.hasBoardAccess = async (userId, boardId) => {
    // Find the board by primary key
    const board = await Board.findByPk(boardId);
    // If board not found, no access
    if (!board) return false;

    // If user is the board creator, grant access
    if (board.createdBy === userId) return true;

    // Check if the user is a member of the board
    const isMember = await BoardMember.findOne({
        where: { userId, boardId }
    });

    // Return true if member exists, false otherwise
    return !!isMember;
};
