const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Explicitly handle empty password (XAMPP default root has no password)
const dbPassword = process.env.DB_PASS && process.env.DB_PASS.trim() !== ''
  ? process.env.DB_PASS
  : null;

const isLocalhost = !process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';
const needsSSL = !isLocalhost; // Aiven and other cloud providers require SSL

const sequelize = new Sequelize(
  process.env.DB_NAME || 'clinic_db',
  process.env.DB_USER || 'root',
  dbPassword,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    ...(needsSSL && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        }
      }
    }),
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
