const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');

const BoardInvitation = sequelize.define('BoardInvitation', {
    boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    invitedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    invitedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'declined'),
        defaultValue: 'pending',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: DataTypes.NOW,
    }},{
        updatedAt: false
    });
module.exports = BoardInvitation;