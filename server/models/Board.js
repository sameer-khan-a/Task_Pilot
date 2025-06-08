// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the Board model with fields: name, description, and userId
const Board = sequelize.define('Board', {
  // Name of the board - required
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Optional description of the board
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    defaultValue: 0,
  }
  // Foreign key reference to the user who owns the board

},
{
  timestamps: true,
});

// Export the Board model so it can be used in other parts of the application
module.exports = Board;
