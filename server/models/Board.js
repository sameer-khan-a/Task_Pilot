// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the Board model with fields: name, description, and createdBy (user ID)
const Board = sequelize.define(
  'Board',
  {
    // Name of the board - required field
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Optional description of the board
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ID of the user who created/owns the board
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Make sure table name is correct in DB
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION',
    },
  },
  {
    // Model options (e.g., timestamps, tableName)
    timestamps: true,
  }
);

// Export the Board model so it can be used in other parts of the application
module.exports = Board;
