const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register User
const registerUser = async (req, res) => {
    try {
        // Frontend-den 'name' gelirse onu 'full_name' kimi qebul edek
        const { name, email, password } = req.body;
        const full_name = name; 

        // Email yoxlanışı
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "This email is already registered." });
        }

        // Şifrənin hash-lənməsi
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Bazada istifadəçi yaratmaq
        const userId = await User.create({
            full_name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ 
            message: "User created successfully!", 
            userId 
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error); // Terminalda deqiq xetani goreceksen
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

// 2. Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email-e gore user tapmaq
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials (Email not found)" });
        }

        // Şifrə müqayisəsi
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials (Wrong password)" });
        }

        // JWT Token yaradılması
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
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
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};

// CRITICAL: Export her iki funksiyani bir yerde etmelidir!
module.exports = { registerUser, loginUser };