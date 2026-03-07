const express = require('express');
const router = express.Router();
const {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');

router.route('/')
    .get(getDoctors)
    .post(protect, restrictTo('admin'), createDoctor);

router.route('/:id')
    .get(getDoctorById)
    .put(protect, restrictTo('admin', 'doctor'), updateDoctor)
    .delete(protect, restrictTo('admin'), deleteDoctor);

module.exports = router;
