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

const jwt = require('jsonwebtoken');

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 2. Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 3. Create JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token lasts for 1 day
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Don't forget to export it
module.exports = { registerUser, loginUser };