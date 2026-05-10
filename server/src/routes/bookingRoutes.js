const express = require('express');
const router = express.Router();

const { 
    createBooking, 
    getMyBookings, 
    getAllBookings, 
    updateBookingStatus 
} = require('../controllers/bookingController');

const { protect, isAdmin } = require('../middlewares/authMiddleware');

// --- Routes ---

router.get('/my', protect, getMyBookings);

router.post('/', protect, createBooking);
router.get('/admin/all', protect, isAdmin, getAllBookings);
router.put('/:id/status', protect, isAdmin, updateBookingStatus);

module.exports = router;