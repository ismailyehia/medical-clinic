const { Doctor, User, Specialization, Appointment, Patient } = require('../models');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Specialization, attributes: ['name'] }
            ]
        });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Specialization, attributes: ['name'] }
            ]
        });

        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create doctor (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
    const { user_id, specialization_id, phone, bio, available_days } = req.body;

    try {
        // Make sure user exists and is a doctor role
        const user = await User.findByPk(user_id);
        if (!user || user.role !== 'doctor') {
            return res.status(400).json({ message: 'User not found or not a doctor role' });
        }

        const doctorExists = await Doctor.findOne({ where: { user_id } });
        if (doctorExists) {
            return res.status(400).json({ message: 'Doctor profile already exists for this user' });
        }

        const doctor = await Doctor.create({
            user_id,
            specialization_id,
            phone,
            bio,
            available_days,
        });

        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin or Doctor)
const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check authorization: Admin or the Doctor themselves
        if (req.user.role !== 'admin' && req.user.id !== doctor.user_id) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        const updatedDoctor = await doctor.update(req.body);
        res.json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // This will also delete the associated user if cascading is set up, 
        // but typically we should explicitly delete the user to be safe
        const user = await User.findByPk(doctor.user_id);
        await doctor.destroy();
        if (user) await user.destroy();

        res.json({ message: 'Doctor removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
};
