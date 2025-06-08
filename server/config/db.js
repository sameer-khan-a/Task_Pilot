const { Sequelize } = require('sequelize');

// Set up Sequelize connection for PostgreSQL using environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Database name
    process.env.DB_USER,      // Database username
    process.env.DB_PASSWORD,  // Database password
    {
        host: process.env.DB_HOST,    // Database host (e.g., localhost)
        dialect: 'postgres',          // Database dialect
        port: process.env.DB_PORT     // Database port (usually 5432 for Postgres)
    }
);

// Function to test the database connection
const connectDB = async () => {
    try {
        // Attempt to connect and authenticate with the DB
        await sequelize.authenticate();
        console.log('Postgres connected !!!');
    } catch (err) {
        // If connection fails, log the error and exit process
        console.log('Unable to connect to the database:', err.message);
        process.exit(1);
    }
};

// Export the Sequelize instance and connection function
module.exports = { sequelize, connectDB };
