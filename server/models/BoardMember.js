const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the BoardMember model representing the many-to-many relationship
// between users and boards, with an additional 'role' field.
const BoardMember = sequelize.define('BoardMember', {
    // Role of the member on the board, default is 'member'
    role: {
        type: DataTypes.STRING,
        defaultValue: 'member',
    }
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
});

module.exports = BoardMember;
