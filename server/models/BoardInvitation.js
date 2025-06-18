// Import required modules from Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the BoardInvitation model
const BoardInvitation = sequelize.define('BoardInvitation', {
  
  // ID of the board to which the user is being invited
  boardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // ID of the user who is being invited
  invitedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // ID of the user who sent the invitation
  invitedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // Status of the invitation: pending, accepted, or declined
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined'),
    defaultValue: 'pending',
  },

  // Timestamp of when the invitation was created
  createdAt: {
    type: DataTypes.DATE,
    allowNull: DataTypes.NOW, // Defaults to current date/time if not provided
  }

}, {
  // Disable updatedAt column since it's not needed
  updatedAt: false,
});

// Export the model to be used in other parts of the app
module.exports = BoardInvitation;
