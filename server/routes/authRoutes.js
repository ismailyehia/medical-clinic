const express = require('express');
const router = express.Router();
const { registerPatient, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerPatient);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
