const db = require('../config/db');

// 1. Create a New Booking (price_per_day ilə)
const createBooking = async (req, res) => {
    try {
        const { car_id, start_date, end_date } = req.body;
        const user_id = req.user.id; 

        const [carRows] = await db.execute('SELECT price_per_day FROM cars WHERE id = ?', [car_id]);
        
        if (carRows.length === 0) {
            return res.status(404).json({ message: "Car not found in our fleet" });
        }
        const dailyPrice = carRows[0].price_per_day;

        // B. Günlərin sayını hesablayaq
        const start = new Date(start_date);
        const end = new Date(end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 

        // C. Ümumi qiyməti hesablayaq
        const total_price = diffDays * dailyPrice;

        // D.  Overlap yoxlanışı
        const [existing] = await db.execute(
            `SELECT * FROM bookings 
             WHERE car_id = ? AND 
             ((start_date <= ? AND end_date >= ?) OR 
              (start_date >= ? AND start_date <= ?))`,
            [car_id, end_date, start_date, start_date, end_date]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Car is already booked for these dates!" });
        }

        // E.  Sifarişi bazaya yazırıq
        await db.execute(
            'INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, car_id, start_date, end_date, total_price, 'pending']
        );

        res.status(201).json({ 
            message: `Booking successful! Total: $${total_price}`,
            total_price: total_price
        });

    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);
        res.status(500).json({ message: "Server error during booking", error: error.message });
    }
};


const getMyBookings = async (req, res) => {
    try {
        // req.user.id-ni mütləq rəqəmə çeviririk
        const userId = parseInt(req.user.id); 
        
        // Terminala bax: Buradakı rəqəm 1-dirmi?
        console.log("----------------------------");
        console.log("LOGGED IN USER ID:", userId);
        console.log("----------------------------");

        const [rows] = await db.execute(
            `SELECT b.id, b.start_date, b.end_date, b.total_price, b.status, 
                    c.brand, c.model 
             FROM bookings b
             JOIN cars c ON b.car_id = c.id
             WHERE b.user_id = ? 
             ORDER BY b.created_at DESC`,
            [userId]
        );

        console.log("FOUND ROWS FOR THIS USER:", rows.length);
        res.status(200).json(rows);
    } catch (error) {
        console.error("GET MY BOOKINGS ERROR:", error);
        res.status(500).json({ message: "Error fetching bookings" });
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
        res.status(500).json({ message: "Admin Error", error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; 
        const [result] = await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: `Updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };