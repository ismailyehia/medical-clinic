const bcrypt = require('bcryptjs');
const { User, Patient, Doctor } = require('../models');
const generateToken = require('../utils/generateToken');

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
const registerPatient = async (req, res) => {
    try {
        const { name, email, password, phone, date_of_birth, gender } = req.body;

        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'patient',
        });

        if (user) {
            await Patient.create({
                user_id: user.id,
                phone,
                date_of_birth,
                gender,
            });

            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (user) {
            // Include role-specific data if needed
            let profileData = { user };

            if (user.role === 'patient') {
                const patient = await Patient.findOne({ where: { user_id: user.id } });
                profileData.patient = patient;
            } else if (user.role === 'doctor') {
                const doctor = await Doctor.findOne({ where: { user_id: user.id } });
                profileData.doctor = doctor;
            }

            res.json(profileData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerPatient,
    loginUser,
    getUserProfile,
};
