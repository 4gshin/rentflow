const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // Test mail for validation
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "This email is already registered." });
        }

        // 2. Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create user in the database
        const userId = await User.create({
            full_name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User created successfully!", userId });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { registerUser };