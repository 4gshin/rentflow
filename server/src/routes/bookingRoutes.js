const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');


router.post('/', protect, createBooking);

router.get('/my-bookings', protect, getMyBookings);
router.get('/admin/all', protect, isAdmin, getAllBookings);

module.exports = router;