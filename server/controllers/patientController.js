const { Patient, User } = require('../models');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin or Doctor
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['name', 'email'] }]
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Only Admin, Doctor, or the Patient themselves can view
        if (req.user.role === 'patient' && req.user.id !== patient.user_id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const user = await User.findByPk(patient.user_id);
        await patient.destroy();
        if (user) await user.destroy();

        res.json({ message: 'Patient removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getPatients,
    getPatientById,
    deletePatient,
};
