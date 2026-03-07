const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getNotifications);

router.route('/unread-count')
    .get(protect, getUnreadCount);

router.route('/read-all')
    .put(protect, markAllAsRead);

router.route('/:id/read')
    .put(protect, markAsRead);

module.exports = router;
