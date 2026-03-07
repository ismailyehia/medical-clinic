const { MedicalRecord, Patient, Doctor, User } = require('../models');

// @desc    Get medical records for a specific patient
// @route   GET /api/records/:patientId
// @access  Private
const getRecords = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify authorization
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ where: { user_id: req.user.id } });
            if (patient.id.toString() !== patientId) {
                return res.status(403).json({ message: 'Not authorized to view these records' });
            }
        }

        const records = await MedicalRecord.findAll({
            where: { patient_id: patientId },
            include: [
                { model: Doctor, include: [{ model: User, attributes: ['name', 'specialization_id'] }] }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new medical record
// @route   POST /api/records
// @access  Private (Doctor or Admin)
const createRecord = async (req, res) => {
    try {
        const { patient_id, diagnosis, prescription, notes } = req.body;
        let doctor_id = req.body.doctor_id;

        if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
            if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
            doctor_id = doctor.id;
        }

        const record = await MedicalRecord.create({
            patient_id,
            doctor_id,
            diagnosis,
            prescription,
            notes,
        });

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getRecords,
    createRecord,
};
