const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');

const Notification = sequelize.define('Notification', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    boardId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    updatedAt: false,
}
);
module.exports = Notification;