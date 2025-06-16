const User = require('./User');
const Board = require('./Board');
const Task = require('./Task');
const BoardMember = require('./BoardMember');
const BoardInvitation = require('./BoardInvitation');
// Define many-to-many relationship between Users and Boards through BoardMember join table
// This sets up which boards a user is a member of (sharedBoards)
User.belongsToMany(Board, {
  through: BoardMember,
  foreignKey: 'userId',      // The foreign key in BoardMember pointing to User
  otherKey: 'boardId',       // The other foreign key pointing to Board
  as: 'sharedBoards',        // Alias for accessing boards a user belongs to
});

// Define inverse many-to-many relationship from Board to Users (members)
Board.belongsToMany(User, {
  through: BoardMember,
  foreignKey: 'boardId',     // The foreign key in BoardMember pointing to Board
  otherKey: 'userId',        // The other foreign key pointing to User
  as: 'members',             // Alias for accessing users who belong to the board
});

// Setup BoardMember belonging to User with cascade delete if user is deleted
BoardMember.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',       // If User is deleted, remove corresponding BoardMembers
});

// Setup BoardMember belonging to Board with cascade delete if board is deleted
BoardMember.belongsTo(Board, {
  foreignKey: 'boardId',
  onDelete: 'CASCADE',       // If Board is deleted, remove corresponding BoardMembers
});

// User has many BoardMember entries (boards they belong to)
User.hasMany(BoardMember, { foreignKey: 'userId' });

// Board has many BoardMember entries (members it contains)
Board.hasMany(BoardMember, { foreignKey: 'boardId' });

// Task belongs to a Board (each task is associated with one board)
Task.belongsTo(Board, { foreignKey: 'boardId' });

// Board can have many Tasks
Board.hasMany(Task, { foreignKey: 'boardId' });

// Task belongs to a User (the creator or assignee of the task)
Task.belongsTo(User, { foreignKey: 'userId' });

// User can have many Tasks assigned or created by them
User.hasMany(Task, { foreignKey: 'userId' });

BoardInvitation.belongsTo(User, {foreignKey: 'invitedUserId', as: 'invitedUser'});

BoardInvitation.belongsTo(User, {foreignKey: 'invitedBy', as:'inviter'});

BoardInvitation.belongsTo(Board, {foreignKey: 'boardId'});
// Export all models for use elsewhere in the app
module.exports = { User, Board, Task, BoardMember };

