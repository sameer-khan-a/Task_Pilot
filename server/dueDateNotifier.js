const cron = require('node-cron');
const moment = require('moment');
const { Task, Notification, Board, BoardMember } = require('./models');
const { Op } = require('sequelize');

const checkDueDateNotifications = async () => {
  const today = moment().startOf('day');

  try {
    const tasks = await Task.findAll({
      where: {
        dueDate: {
          [Op.lte]: moment(today).add(2, 'days').toDate()
        }
      }
    });

    for (const task of tasks) {
      const daysLeft = moment(task.dueDate).startOf('day').diff(today, 'days');
      let message = '';
      const board = await Board.findByPk(task.boardId);

      if (daysLeft === 2) message = `⏳ Only 2 days left for task "${task.title}".\nFrom "${board.name}" board.`;
      else if (daysLeft === 1) message = `⚠️ Task "${task.title}" is due tomorrow.\nFrom "${board.name}" board.`;
      else if (daysLeft === 0) message = `📌 Task "${task.title}" is due today.\nFrom "${board.name}" board.`;
      else if (daysLeft < 0) message = `❗Task "${task.title}" is overdue.\nFrom "${board.name}" board.`;

    const members = await BoardMember.findAll({ where: { boardId: task.boardId } });


// Combine members + board owner
const allUserIds = members.map(m => m.userId);
if (board && !allUserIds.includes(board.createdBy)) {
  allUserIds.push(board.createdBy);
}

for (const userId of allUserIds) {
  const existing = await Notification.findOne({
    where: {
      userId,
      taskId: task.id
    }
  });

  if (message) {
    if (!existing) {
      const newNotification = await Notification.create({
        userId,
        createdBy: task.userId,
        taskId: task.id,
        boardId: task.boardId || null,
        message
      });
      if (global.io) {
        global.io.to(`user-${userId}`).emit('notification:new', newNotification);
      }
    } else if (existing.message !== message) {
      existing.message = message;
      await existing.save();
      if (global.io) {
        global.io.to(`user-${userId}`).emit('notification:update', existing.toJSON());
      }
    }
  } else {
    if (existing) {
      await Notification.destroy({
        where: {
          userId,
          taskId: task.id
        }
      });
      if (global.io) {
        global.io.to(`user-${userId}`).emit('notification:delete', { taskId: task.id });
      }
    }
  }
}}
    console.log(`✅ Due date notification check completed. Found ${tasks.length} tasks.`);
  } catch (error) {
    console.error('❌ Error in due date notifier:', error);
  }
};

module.exports = { checkDueDateNotifications };
