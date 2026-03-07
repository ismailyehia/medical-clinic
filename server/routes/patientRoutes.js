const express = require('express');
const router = express.Router();
const {
    getPatients,
    getPatientById,
    deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');

router.route('/')
    .get(protect, restrictTo('admin', 'doctor'), getPatients);

router.route('/:id')
    .get(protect, getPatientById)
    .delete(protect, restrictTo('admin'), deletePatient);

module.exports = router;
