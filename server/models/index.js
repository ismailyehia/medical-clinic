const { sequelize } = require('../config/db');
const User = require('./User');
const Specialization = require('./Specialization');
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const Notification = require('./Notification');

// User <-> Doctor (One to One)
User.hasOne(Doctor, { foreignKey: 'user_id' });
Doctor.belongsTo(User, { foreignKey: 'user_id' });

// Specialization <-> Doctor (One to Many)
Specialization.hasMany(Doctor, { foreignKey: 'specialization_id' });
Doctor.belongsTo(Specialization, { foreignKey: 'specialization_id' });

// User <-> Patient (One to One)
User.hasOne(Patient, { foreignKey: 'user_id' });
Patient.belongsTo(User, { foreignKey: 'user_id' });

// Patient <-> Appointment (One to Many)
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });

// Doctor <-> Appointment (One to Many)
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id' });

// Patient <-> MedicalRecord (One to Many)
Patient.hasMany(MedicalRecord, { foreignKey: 'patient_id' });
MedicalRecord.belongsTo(Patient, { foreignKey: 'patient_id' });

// Doctor <-> MedicalRecord (One to Many)
Doctor.hasMany(MedicalRecord, { foreignKey: 'doctor_id' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctor_id' });

// User <-> Notification (One to Many)
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    Specialization,
    Doctor,
    Patient,
    Appointment,
    MedicalRecord,
    Notification,
};
