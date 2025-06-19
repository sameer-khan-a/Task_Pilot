// Import the Task model
const Task = require('../models/Task');
const {hasBoardAccess}  = require('../utils/permissions');

// Controller to create a new task
exports.createTask = async (req, res) => {
  const { title, description, status, boardId, dueDate } = req.body;

  try {
    const access = await hasBoardAccess(req.user.id, boardId);
    if(!access) return res.status(403).json({msg: "Access denied to this board"});
    // Create a new task record in the database
    const task = await Task.create({ title, description, status, boardId, dueDate });

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
exports.updateTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    // Find the task by primary key (taskId)
    const task = await Task.findByPk(req.params.taskId);

    // If task doesn't exist, return 404
    if (!task) return res.status(404).json({ msg: "Task does not exist" });

    const access = await hasBoardAccess(req.user.id, task.boardId);
    if(!access) return res.status(403).json({msg: "Access denied to this board's task"});
    // Update fields only if they are provided, otherwise keep existing values
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    // Save the updated task to the database
    await task.save();

    // Respond with the updated task and HTTP status 200 (OK)
    res.status(200).json(task);
  } catch (err) {
    // Handle errors during task update
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

    // Respond with success message and HTTP status 200 (OK)
    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (err) {
    // Handle errors during task deletion
    res.status(500).json({ msg: "Error deleting task !!!", error: err.message });
  }
};
