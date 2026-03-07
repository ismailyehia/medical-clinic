const { Appointment, Patient, Doctor, User, Notification } = require('../models');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    try {
        let whereClause = {};

        // Filter based on role
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ where: { user_id: req.user.id } });
            if (!patient) return res.json([]);
            whereClause.patient_id = patient.id;
        } else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
            if (!doctor) return res.json([]);
            whereClause.doctor_id = doctor.id;
        }

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                {
                    model: Patient,
                    include: [{ model: User, attributes: ['name', 'email'] }]
                },
                {
                    model: Doctor,
                    include: [{ model: User, attributes: ['name', 'email'] }]
                }
            ],
            order: [['appointment_date', 'DESC']]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient or Admin)
const createAppointment = async (req, res) => {
    try {
        const { doctor_id, appointment_date, notes } = req.body;

        let patient_id = req.body.patient_id;

        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ where: { user_id: req.user.id } });
            if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
            patient_id = patient.id;
        }

        const appointment = await Appointment.create({
            patient_id,
            doctor_id,
            appointment_date,
            notes,
        });

        // --- Create Notifications ---
        try {
            const doctor = await Doctor.findByPk(doctor_id, {
                include: [{ model: User, attributes: ['id', 'name'] }]
            });
            const patient = await Patient.findByPk(patient_id, {
                include: [{ model: User, attributes: ['id', 'name'] }]
            });

            const dateStr = new Date(appointment_date).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            // Notify the patient
            if (patient?.User) {
                await Notification.create({
                    user_id: patient.User.id,
                    title: 'Appointment Booked',
                    message: `Your appointment with Dr. ${doctor?.User?.name || 'your doctor'} on ${dateStr} has been booked successfully.`,
                    type: 'appointment',
                });
            }

            // Notify the doctor
            if (doctor?.User) {
                await Notification.create({
                    user_id: doctor.User.id,
                    title: 'New Appointment',
                    message: `You have a new appointment with ${patient?.User?.name || 'a patient'} on ${dateStr}.`,
                    type: 'appointment',
                });
            }
        } catch (notifError) {
            console.error('Failed to create notifications:', notifError.message);
        }

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update appointment status/notes
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
    try {
        const { status, notes, appointment_date } = req.body;
        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Role-based authorization logic
        // Doctors can update status and notes of their appointments
        // Patients can cancel their appointments
        // Admin can update anything

        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ where: { user_id: req.user.id } });
            if (appointment.patient_id !== patient.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            // Patients can only cancel or update date if status is still pending
            if (status && status !== 'cancelled' && appointment.status !== 'pending') {
                return res.status(403).json({ message: 'Cannot update this appointment' });
            }
        } else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
            if (appointment.doctor_id !== doctor.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        if (status) appointment.status = status;
        if (notes !== undefined) appointment.notes = notes;
        if (appointment_date) appointment.appointment_date = appointment_date;

        await appointment.save();

        // --- Send notification on status change ---
        if (status) {
            try {
                const patient = await Patient.findByPk(appointment.patient_id, {
                    include: [{ model: User, attributes: ['id', 'name'] }]
                });
                const doctor = await Doctor.findByPk(appointment.doctor_id, {
                    include: [{ model: User, attributes: ['id', 'name'] }]
                });

                const statusMessages = {
                    approved: `Your appointment with Dr. ${doctor?.User?.name || 'your doctor'} has been approved.`,
                    completed: `Your appointment with Dr. ${doctor?.User?.name || 'your doctor'} has been marked as completed.`,
                    cancelled: `Your appointment with Dr. ${doctor?.User?.name || 'your doctor'} has been cancelled.`,
                };

                if (patient?.User && statusMessages[status]) {
                    await Notification.create({
                        user_id: patient.User.id,
                        title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                        message: statusMessages[status],
                        type: 'status_update',
                    });
                }
            } catch (notifError) {
                console.error('Failed to create status notification:', notifError.message);
            }
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ where: { user_id: req.user.id } });
            if (appointment.patient_id !== patient.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }
        } else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
            if (appointment.doctor_id !== doctor.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        await appointment.destroy();
        res.json({ message: 'Appointment removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
};
