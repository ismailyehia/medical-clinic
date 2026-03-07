const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Doctor = sequelize.define('Doctor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    specialization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
    },
    bio: {
        type: DataTypes.TEXT,
    },
    available_days: {
        type: DataTypes.STRING, // Store as JSON string or comma-separated days
    },
}, {
    tableName: 'doctors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Doctor;
