// Load environment variables from the .env file into process.env
require('dotenv').config();

// Import all Sequelize models (this registers the models with the Sequelize instance)
require('./models');

// Import core modules
const express = require('express');

// Import database connection functions and Sequelize instance
const { connectDB } = require('./config/db');
const { sequelize } = require('./config/db');

// Import route handlers for different parts of the API
const boardRoutes = require('./routes/boardRoutes');
const taskRoutes = require('./routes/taskRoutes');
const boardMemberRoutes = require('./routes/boardMemberRoutes');
const invitationRoutes = require('./routes/invitationRoutes');

// Connect to the database
connectDB();

// Sync Sequelize models with the database
// `alter: true` updates tables to match the current model definitions without dropping them
sequelize.sync({ alter: true })
  .then(() => {
    console.log('📦 All Tables synced');
  })
  .catch(err => {
    console.error('❌ Failed to sync Databases: ', err);
  });

// Initialize the Express app
const app = express();

// Enable CORS (Cross-Origin Resource Sharing) to allow frontend apps from different origins to communicate
const cors = require("cors");
app.use(cors({
  origin: "*",
  credentials: true,
}));

// Middleware to parse JSON bodies in incoming requests
app.use(express.json());

// Mount API route handlers
app.use('/api/invitations', invitationRoutes); // Routes for handling board invitations
app.use('/api/auth', require('./routes/authRoutes')); // Routes for authentication (login, register, etc.)
app.use('/api/user', require('./routes/userRoutes')); // Routes for user profile and user data
app.use('/api/boards', boardRoutes); // Routes for board CRUD operations
app.use('/api/tasks', taskRoutes); // Routes for task CRUD operations
app.use('/api/boardMembers', boardMemberRoutes); // Routes for managing board members

// Start the server on the specified port (default is 5000 if not in .env)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
