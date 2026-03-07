const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    prescription: {
        type: DataTypes.TEXT,
    },
    notes: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'medical_records',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MedicalRecord;
