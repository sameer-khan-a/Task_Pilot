// Import the Task model
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Board = require('../models/Board');
const moment = require('moment');
const {hasBoardAccess}  = require('../utils/permissions');
const {checkDueDateNotifications} = require('../dueDateNotifier');
// Controller to create a new task
exports.createTask = async (req, res) => {
  const { title, description, status, boardId, dueDate} = req.body;
  const userId = req.user.id;
  try {
    const access = await hasBoardAccess(req.user.id, boardId);
    if(!access) return res.status(403).json({msg: "Access denied to this board"});
    // Create a new task record in the database
    const task = await Task.create({ title, description, status, boardId, dueDate, userId });
    
    const today = moment().startOf('day');
    const due = moment(task.dueDate).startOf('day');
    const daysLeft = due.diff(today, 'days');
     const board = await Board.findByPk(
                 task.boardId
            )
     let message = ``;
             if(daysLeft === 2) message = `⏳ Only 2 days left for task "${task.title}". \n from "${board.title}" board".`;
            else if(daysLeft === 1) message = `⚠️ Task "${task.title}" is due tomorrow. \n from "${board.title}" board`;
            else if(daysLeft === 0) message = `📌 Task "${task.title}" is due today. \n from "${board.title}" board`;
            else if(daysLeft < 0) message = `❗Task "${task.title}" is overdue. \n from "${board.title}" board`;
            if (message) {
                
                const newNotification = await Notification.create({
                        userId: task.userId,
                        taskId: task.id,
                        boardId: task.boardId || null,
                        message
                    });
                      if(global.io) {
                        global.io.to(`user-${task.userId}`).emit('notification:new', newNotification);
                    }
            }
    
    await checkDueDateNotifications();
    // Respond with the created task and HTTP status 201 (Created)
    res.status(201).json(task);
  } catch (err) {
    // Handle errors during task creation
    res.status(500).json({ msg: "Can't create task", error: err.message });
  }
};

// Controller to get all tasks for a specific board
exports.getTasks = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const access = await hasBoardAccess(req.user.id, boardId);
    if(!access) return res.status(403).json({msg: "Access denied to this board's tasks"});
    // Find all tasks where boardId matches the route parameter
    const tasks = await Task.findAll({ where: { boardId } });
    
    // Respond with the list of tasks and HTTP status 200 (OK)
    res.status(200).json(tasks);
  } catch (err) {
    // Handle errors during fetching tasks
    res.status(500).json({ msg: "Error getting tasks", error: err.message });
  }
};

// Controller to update an existing task by taskId
// Controller to update an existing task by taskId
exports.updateTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  try {
    

    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ msg: "Task does not exist" });

    const access = await hasBoardAccess(req.user.id, task.boardId);
    if (!access) return res.status(403).json({ msg: "Access denied to this board's task" });

    const previousDueDate = task.dueDate;

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    // Handle due date notification
    if (dueDate && !moment(dueDate).isSame(moment(previousDueDate))) {
      const today = moment().startOf('day');
      const due = moment(task.dueDate).startOf('day');
      const daysLeft = due.diff(today, 'days');
     const board = await Board.findByPk(
                 task.boardId
            )
      let message = "";
        if(daysLeft === 2) message = `⏳ Only 2 days left for task "${task.title}". \n from "${board.title}" board".`;
            else if(daysLeft === 1) message = `⚠️ Task "${task.title}" is due tomorrow. \n from "${board.title}" board`;
            else if(daysLeft === 0) message = `📌 Task "${task.title}" is due today. \n from "${board.title}" board`;
            else if(daysLeft < 0) message = `❗Task "${task.title}" is overdue. \n from "${board.title}" board`;

      const existingNotification = await Notification.findOne({
        where: { taskId: task.id },
      });

      if (message) {
        if (!existingNotification) {
          const newNotification = await Notification.create({
            userId: task.userId,
            taskId: task.id,
            boardId: task.boardId || null,
            message
          });
          if (global.io) {
            global.io.to(`user-${task.userId}`).emit('notification:new', newNotification);
          }
        } else {
          existingNotification.message = message;
          await existingNotification.save();
          if (global.io) {
            global.io.to(`user-${task.userId}`).emit('notification:update', existingNotification);
          }
        }
      } else {
        if (existingNotification) {
          await Notification.destroy({
            where: { userId: task.userId, taskId: task.id }
          });
          if (global.io) {
            global.io.to(`user-${task.userId}`).emit('notification:delete', { taskId: task.id });
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


// Controller to delete a task by taskId
exports.deleteTask = async (req, res) => {
  try {
    // Find the task by primary key (taskId)
    const task = await Task.findByPk(req.params.taskId);
    
    // If task not found, return 404
    if (!task) return res.status(404).json({ msg: "Task not found !!!" });
    
    const access = await hasBoardAccess(req.user.id, task.boardId);
    if(!access) return res.status(403).json({msg: "Access denied to this board's task"});
    // Delete the task from the database
    await task.destroy();
    await Notification.destroy({where: {taskId: task.id}});
      if (global.io) {
      global.io.to(`user-${task.userId}`).emit('notification:delete', { taskId: task.id });
    }

    // Respond with success message and HTTP status 200 (OK)
    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (err) {
    // Handle errors during task deletion
    res.status(500).json({ msg: "Error deleting task !!!", error: err.message });
  }
};
