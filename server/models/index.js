// Import Sequelize models
const User = require('./User');
const Board = require('./Board');
const Task = require('./Task');
const BoardMember = require('./BoardMember');
const BoardInvitation = require('./BoardInvitation');
const Notification = require('./Notification');

// ---------------------- User ↔ Board (Many-to-Many via BoardMember) ----------------------

User.belongsToMany(Board, {
  through: BoardMember,
  foreignKey: 'userId',
  otherKey: 'boardId',
  as: 'sharedBoards',
});

Board.belongsToMany(User, {
  through: BoardMember,
  foreignKey: 'boardId',
  otherKey: 'userId',
  as: 'members',
});

// ---------------------- BoardMember Relationships ----------------------

BoardMember.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  as: 'User',
});

BoardMember.belongsTo(Board, {
  foreignKey: 'boardId',
  onDelete: 'CASCADE',
  as: 'Board',
});

User.hasMany(BoardMember, { foreignKey: 'userId', as: 'BoardMemberships' });
Board.hasMany(BoardMember, { foreignKey: 'boardId', as: 'BoardMembers' }); // ❗ renamed from 'BoardMember' to 'BoardMembers'

// ---------------------- Board ↔ Task (One-to-Many) ----------------------

Task.belongsTo(Board, { foreignKey: 'boardId', as: 'Board' });
Board.hasMany(Task, { foreignKey: 'boardId', as: 'Tasks' });

// ---------------------- User ↔ Task (One-to-Many) ----------------------

Task.belongsTo(User, { foreignKey: 'userId', as: 'Creator' });
User.hasMany(Task, { foreignKey: 'userId', as: 'Tasks' });

// ---------------------- BoardInvitation Relationships ----------------------

Board.hasMany(BoardInvitation, { foreignKey: 'boardId', as: 'Invitations' });

BoardInvitation.belongsTo(User, {
  foreignKey: 'invitedUserId',
  as: 'InvitedUser', // ❗ fix alias to match what's used in controllers
});

BoardInvitation.belongsTo(User, {
  foreignKey: 'invitedBy',
  as: 'Inviter',
});

BoardInvitation.belongsTo(Board, {
  foreignKey: 'boardId',
  onDelete: 'CASCADE',
  as: 'Board',
});

// ---------------------- Notification ↔ Task & User ----------------------

Task.hasMany(Notification, {
  foreignKey: 'taskId',
  onDelete: 'CASCADE',
  as: 'Notifications',
});

Notification.belongsTo(Task, {
  foreignKey: 'taskId',
  onDelete: 'CASCADE',
  as: 'Task',
});

User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'Notifications',
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'User',
});

// ---------------------- Board Owner Relationship ----------------------

Board.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'owner',
});

// ---------------------- Export all models ----------------------

module.exports = {
  User,
  Board,
  Task,
  BoardMember,
  BoardInvitation,
  Notification,
};
