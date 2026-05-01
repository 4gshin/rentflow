const db = require('../config/db');

const Booking = {
    create: async (bookingData) => {
        const { user_id, car_id, start_date, end_date, total_price } = bookingData;
        const [result] = await db.query(
            'INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)',
            [user_id, car_id, start_date, end_date, total_price]
        );
        return result.insertId;
    },
    
    getByUser: async (user_id) => {
        const [rows] = await db.query(
            'SELECT b.*, c.brand, c.model FROM bookings b JOIN cars c ON b.car_id = c.id WHERE b.user_id = ?',
            [user_id]
        );
        return rows;
    }
};

module.exports = Booking;