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
Board.hasMany(BoardMember, { foreignKey: 'boardId', as: 'BoardMembers' });

// ---------------------- Board ↔ Task (One-to-Many) ----------------------

Board.hasMany(Task, { foreignKey: 'boardId', as: 'Tasks' });
Task.belongsTo(Board, { foreignKey: 'boardId', as: 'Board' });

// ---------------------- User ↔ Task (One-to-Many) ----------------------

User.hasMany(Task, { foreignKey: 'userId', as: 'Tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'Creator' }); // optional alias

// ---------------------- BoardInvitation Relationships ----------------------

BoardInvitation.belongsTo(User, {
  foreignKey: 'invitedUserId',
  as: 'InvitedUser',
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

Board.hasMany(BoardInvitation, {
  foreignKey: 'boardId',
  as: 'Invitations',
});

// ---------------------- Task ↔ Notification (One-to-Many) ----------------------

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

// ---------------------- User ↔ Notification (One-to-Many) ----------------------

User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'Notifications',
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'User',
});
Board.belongsTo(User, { foreignKey: 'createdBy', as: 'owner' });

// ---------------------- Export all models ----------------------

module.exports = {
  User,
  Board,
  Task,
  BoardMember,
  BoardInvitation,
  Notification,
};
