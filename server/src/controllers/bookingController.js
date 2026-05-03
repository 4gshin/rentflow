const db = require('../config/db');

// 1. Create a New Booking (with overlap check)
const createBooking = async (req, res) => {
    try {
        const { car_id, start_date, end_date } = req.body;
        const user_id = req.user.id; 

        // Overlap yoxlanışı
        const [existing] = await db.execute(
            `SELECT * FROM bookings 
             WHERE car_id = ? AND 
             ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?))`,
            [car_id, end_date, start_date, start_date, end_date]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Car is already booked for these dates!" });
        }

        // Əgər boşdursat, sifarişi yaradırıq
        await db.execute(
            'INSERT INTO bookings (user_id, car_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, car_id, start_date, end_date, 'confirmed']
        );

        res.status(201).json({ message: "Booking successful! Enjoy your ride." });
    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);
        res.status(500).json({ message: "Server error during booking", error: error.message });
    }
};

// 2. Get Personal Bookings (User Profile üçün)
const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id; 
        const [rows] = await db.execute(
            `SELECT b.*, c.brand, c.model, c.daily_price 
             FROM bookings b
             JOIN cars c ON b.car_id = c.id
             WHERE b.user_id = ? 
             ORDER BY b.start_date DESC`,
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your bookings", error: error.message });
    }
};

// 3. Get All Bookings (Admin Panel üçün)
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

// 4. Update Booking Status (Cancel və ya Complete üçün)
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

// İxrac: Yalnız bir module.exports olmalıdır
module.exports = { 
    createBooking, 
    getMyBookings, 
    getAllBookings, 
    updateBookingStatus 
};