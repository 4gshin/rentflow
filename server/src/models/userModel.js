const db = require('../config/db');

const User = {
    // Find user by email for authentication
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Create a new user in the database
    create: async (userData) => {
        const { full_name, email, password } = userData;
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
            [full_name, email, password]
        );
        return result.insertId;
    },

    // 🟢 1. Find user by ID (Get Profile üçün) 
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    // 🟢 2. Update user profile details (Inline settings üçün)
    updateProfileData: async (id, { full_name, phone_number, bio }) => {
        const [result] = await db.query(
            'UPDATE users SET full_name = ?, phone_number = ?, bio = ? WHERE id = ?',
            [full_name, phone_number, bio, id]
        );
        return result;
    }
};

module.exports = User;
