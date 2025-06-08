const { Sequelize } = require('sequelize');

// Create Sequelize instance using DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // Optional: disable SQL logging
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Needed for Render's SSL
        }
    }
});

// Function to test the database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Postgres connected !!!');
    } catch (err) {
        console.error('Unable to connect to the database:', err.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
