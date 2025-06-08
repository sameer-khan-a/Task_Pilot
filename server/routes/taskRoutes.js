const express = require('express');
const router = express.Router();

// Import controller functions to handle task-related operations
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/TaskController');

// Middleware to protect routes by checking authentication
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a new task (protected)
router.post('/create', authMiddleware, createTask);

// Route to update an existing task by taskId (protected)
router.put('/:taskId', authMiddleware, updateTask);

// Route to delete an existing task by taskId (protected)
router.delete('/:taskId', authMiddleware, deleteTask);

// Route to get all tasks for a specific board by boardId (protected)
router.get('/:boardId', authMiddleware, getTasks);

// Export the router to be used in the main app
module.exports = router;
