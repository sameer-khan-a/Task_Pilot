const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Board = require('../models/Board');
const moment = require('moment');
const { hasBoardAccess } = require('../utils/permissions');
const { checkDueDateNotifications } = require('../dueDateNotifier');
const { BoardMember, User } = require('../models');

// CREATE TASK
exports.createTask = async (req, res) => {
  const { title, description, status, boardId, dueDate } = req.body;
  const userId = req.user.id;

  try {
    const access = await hasBoardAccess(userId, boardId);
    if (!access) return res.status(403).json({ msg: "Access denied to this board" });

    const task = await Task.create({ title, description, status, boardId, dueDate, userId });

    const today = moment().startOf('day');
    const due = moment(task.dueDate).startOf('day');
    const daysLeft = due.diff(today, 'days');

    const board = await Board.findByPk(task.boardId);
    let message = "";

    if (daysLeft === 2) message = `⏳ Only 2 days left for task "${task.title}".\nFrom "${board.name}" board.`;
    else if (daysLeft === 1) message = `⚠️ Task "${task.title}" is due tomorrow.\nFrom "${board.name}" board`;
    else if (daysLeft === 0) message = `📌 Task "${task.title}" is due today.\nFrom "${board.name}" board`;
    else if (daysLeft < 0) message = `❗Task "${task.title}" is overdue.\nFrom "${board.name}" board`;

    if (message) {
      const members = await BoardMember.findAll({ where: { boardId } });

      for (const m of members) {
        const newNotification = await Notification.create({
          userId: m.id,
          taskId: task.id,
          boardId,
          message
        });

        if (global.io) {
          global.io.to(`user-${m.id}`).emit('notification:new', newNotification);
        }
      }
    }

    await checkDueDateNotifications();
    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ msg: "Can't create task", error: err.message });
  }
};

// GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const access = await hasBoardAccess(req.user.id, boardId);
    if (!access) return res.status(403).json({ msg: "Access denied to this board's tasks" });

    const tasks = await Task.findAll({ where: { boardId } });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error getting tasks", error: err.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ msg: "Task does not exist" });

    const access = await hasBoardAccess(req.user.id, task.boardId);
    if (!access) return res.status(403).json({ msg: "Access denied to this board's task" });

    const previousDueDate = task.dueDate;
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    if (dueDate && !moment(dueDate).isSame(moment(previousDueDate))) {
      const today = moment().startOf('day');
      const due = moment(task.dueDate).startOf('day');
      const daysLeft = due.diff(today, 'days');

      const board = await Board.findByPk(task.boardId);
      let message = "";

      if (daysLeft === 2) message = `⏳ Only 2 days left for task "${task.title}".\nFrom "${board.name}" board.`;
      else if (daysLeft === 1) message = `⚠️ Task "${task.title}" is due tomorrow.\nFrom "${board.name}" board`;
      else if (daysLeft === 0) message = `📌 Task "${task.title}" is due today.\nFrom "${board.name}" board`;
      else if (daysLeft < 0) message = `❗Task "${task.title}" is overdue.\nFrom "${board.name}" board`;

      const members = await BoardMember.findAll({ where: { boardId: task.boardId } });

      for (const m of members) {
        const existingNotification = await Notification.findOne({
          where: { taskId: task.id, userId: m.id }
        });

        if (message) {
          if (!existingNotification) {
            const newNotification = await Notification.create({
              userId: m.id,
              taskId: task.id,
              boardId: task.boardId,
              message
            });

            if (global.io) global.io.to(`user-${m.id}`).emit('notification:new', newNotification);
          } else {
            existingNotification.message = message;
            await existingNotification.save();
            if (global.io) global.io.to(`user-${m.id}`).emit('notification:update', existingNotification);
          }
        } else {
          if (existingNotification) {
            await existingNotification.destroy();
            if (global.io) global.io.to(`user-${m.id}`).emit('notification:delete', { taskId: task.id });
          }
        }
      }
    }

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ msg: "Error updating task", error: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ msg: "Task not found !!!" });

    const access = await hasBoardAccess(req.user.id, task.boardId);
    if (!access) return res.status(403).json({ msg: "Access denied to this board's task" });

    await task.destroy();
    await Notification.destroy({ where: { taskId: task.id } });

    const members = await BoardMember.findAll({ where: { boardId: task.boardId } });
    for (const m of members) {
      if (global.io) {
        global.io.to(`user-${m.id}`).emit('notification:delete', { taskId: task.id });
      }
    }

    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting task !!!", error: err.message });
  }
};
