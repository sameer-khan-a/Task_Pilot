// Import Sequelize models
const User = require('./User');
const Board = require('./Board');
const Task = require('./Task');
const BoardMember = require('./BoardMember');
const BoardInvitation = require('./BoardInvitation');
const Notification = require('./Notification');
// ---------------------- User ↔ Board (Many-to-Many via BoardMember) ----------------------

// Define many-to-many relationship between Users and Boards through BoardMember join table
// This allows access to boards a user is part of (as a member, not creator)
User.belongsToMany(Board, {
  through: BoardMember,
  foreignKey: 'userId',       // Foreign key in BoardMember pointing to User
  otherKey: 'boardId',        // Other key in BoardMember pointing to Board
  as: 'sharedBoards',         // Alias for user's shared boards
});

// Define inverse many-to-many relationship from Board to Users (members)
Board.belongsToMany(User, {
  through: BoardMember,
  foreignKey: 'boardId',      // Foreign key in BoardMember pointing to Board
  otherKey: 'userId',         // Other key in BoardMember pointing to User
  as: 'members',              // Alias for board members
});

// ---------------------- BoardMember Relationships ----------------------

// BoardMember entry belongs to a specific User
BoardMember.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',        // If user is deleted, their board memberships are removed
});

// BoardMember entry belongs to a specific Board
BoardMember.belongsTo(Board, {
  foreignKey: 'boardId',
  onDelete: 'CASCADE',        // If board is deleted, its memberships are removed
});

// A User can have many BoardMember entries (boards they are part of)
User.hasMany(BoardMember, { foreignKey: 'userId' });

// A Board can have many BoardMember entries (users who are members)
Board.hasMany(BoardMember, { foreignKey: 'boardId' });

// ---------------------- Board ↔ Task (One-to-Many) ----------------------

// Each Task belongs to one Board
Task.belongsTo(Board, { foreignKey: 'boardId' });

// Each Board can have many Tasks
Board.hasMany(Task, { foreignKey: 'boardId' });

// ---------------------- User ↔ Task (One-to-Many) ----------------------

// Each Task is created by or assigned to a User
Task.belongsTo(User, { foreignKey: 'userId' });

// Each User can have many Tasks
User.hasMany(Task, { foreignKey: 'userId' });

// ---------------------- BoardInvitation Relationships ----------------------

// Each invitation points to the invited user
BoardInvitation.belongsTo(User, {
  foreignKey: 'invitedUserId',
  as: 'invitedUser'           // Alias to access user who was invited
});

// Each invitation also points to the inviter (creator of the invitation)
BoardInvitation.belongsTo(User, {
  foreignKey: 'invitedBy',
  as: 'Inviter'               // Alias to access user who sent the invitation
});

// Each invitation is linked to a specific board
BoardInvitation.belongsTo(Board, {
  foreignKey: 'boardId',
  onDelete: 'CASCADE'         // If board is deleted, invitations are also removed
});
Notification.belongsTo(Task, {
  foreignKey: 'taskId',
  onDelete: 'CASCADE',
});
Task.hasMany(Notification, {
  foreignKey: 'taskId',
  onDelete: 'CASCADE',
})
Notification.belongsTo(User, {foreignKey: 'userId'});
// ---------------------- Export all models ----------------------
module.exports = { User, Board, Task, BoardMember, BoardInvitation, Notification };
