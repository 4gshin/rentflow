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
    }
};

module.exports = User;