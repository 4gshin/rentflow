const Booking = require('../models/bookingModel');
const db = require('../config/db'); 


const createBooking = async (req, res) => {
    try {
        const { car_id, start_date, end_date, total_price } = req.body;
        const user_id = req.user.id; 

        const bookingId = await Booking.create({
            user_id,
            car_id,
            start_date,
            end_date,
            total_price
        });

        res.status(201).json({
            message: "Booking created successfully!",
            bookingId
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id; 
        const [rows] = await db.execute(
            'SELECT * FROM bookings WHERE user_id = ?',
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};

module.exports = { createBooking, 
    getMyBookings };