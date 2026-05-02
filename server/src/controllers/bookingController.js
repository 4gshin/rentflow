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

const getAllBookings = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT b.*, u.full_name as customer_name, c.brand, c.model 
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN cars c ON b.car_id = c.id
            ORDER BY b.created_at DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Admin Error: Fetching all bookings failed", error: error.message });
    }
};
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; 

        const [result] = await db.execute(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: `Booking status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };



