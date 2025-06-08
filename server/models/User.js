// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the User model with fields: email and password
const User = sequelize.define('User', {
  // User's email address - must be unique and not null
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // User's password - stored as a hashed string (not plain text)
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Export the User model so it can be used in other parts of the application
module.exports = User;
