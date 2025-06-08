// Load environment variables from the .env file into process.env
require('dotenv').config();

// Import all Sequelize models (to register with sequelize instance)
require('./models');

// Import core modules
const express = require('express');

const cors = require("cors");




// Import database connection functions and Sequelize instance
const { connectDB } = require('./config/db');
const { sequelize } = require('./config/db');

// Import route handlers for different parts of the API
const boardRoutes = require('./routes/boardRoutes');
const taskRoutes = require('./routes/taskRoutes');
const boardMemberRoutes = require('./routes/boardMemberRoutes');

// Connect to the database (could be MongoDB or any other DB based on config)
connectDB();

// Sync Sequelize models with the database
// `alter: true` updates existing tables to match models without dropping data
sequelize.sync({ alter: true })
  .then(() => {
    console.log('📦 All Tables synced');
  })
  .catch(err => {
    console.error('❌ Failed to sync Database: ', err);
  });

// Initialize the Express app
const app = express();

// Enable CORS to allow cross-origin requests from frontend or other clients
app.use(cors({
  origin: "https://task-pilot-mu.vercel.app",  // add https://
  credentials: true
}));

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Setup API routes with their respective route handlers

// Routes for authentication like login, register, etc.
app.use('/api/auth', require('./routes/authRoutes'));

// Routes related to user profile and user data
app.use('/api/user', require('./routes/userRoutes'));

// Routes for board related CRUD operations
app.use('/api/boards', boardRoutes);

// Routes for task related CRUD operations
app.use('/api/tasks', taskRoutes);

// Routes for managing board members (adding, removing, listing members)
app.use('/api/boardMembers', boardMemberRoutes);

// Start the server and listen on the port specified in environment or 5000 by default
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
