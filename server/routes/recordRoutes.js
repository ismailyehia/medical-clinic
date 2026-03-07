const express = require('express');
const router = express.Router();
const {
    getRecords,
    createRecord,
} = require('../controllers/recordController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');

router.route('/')
    .post(protect, restrictTo('admin', 'doctor'), createRecord);

router.route('/:patientId')
    .get(protect, getRecords);

module.exports = router;
