const Booking = require('../models/bookingModel');

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

module.exports = { createBooking };