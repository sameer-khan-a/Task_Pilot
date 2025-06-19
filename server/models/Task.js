// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
// Import the Sequelize instance configured for your database
const { sequelize } = require('../config/db');

// Define the Task model representing a task entity in the database
const Task = sequelize.define('Task', {
  // Title of the task - a required string field
  title: {
    type: DataTypes.STRING,
    allowNull: false,  // Cannot be null, must have a value
  },

  // Optional description providing more details about the task
  description: {
    type: DataTypes.STRING,
    allowNull: true,   // Can be null if no description is provided
  },

  // Status of the task - indicates the current state like 'todo', 'in-progress', or 'done'
  status: {
    type: DataTypes.STRING,
    defaultValue: 'todo', // Default status is 'todo' if none specified
  },

  // Foreign key linking the task to a specific board (required)
  boardId: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Must be associated with a board
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  // Foreign key linking the task to a user (optional)
  // Could be the creator or assignee of the task
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false  // Can be null if unassigned
  }
});

// Export the Task model so it can be imported and used elsewhere in the application
module.exports = Task;
