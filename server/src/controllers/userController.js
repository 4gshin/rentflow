const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const full_name = name; 

        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "This email is already registered." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

// 2. Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials (Email not found)" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials (Wrong password)" });
        }

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

// 🟢 3. Get User Profile (Dropdown və Qaraj məlumatları üçün)
const getProfile = async (req, res) => {
    try {
        // req.user.id bizə 'protect' middleware-indən (JWT) gəlir
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number || "",
            bio: user.bio || "Premium Driver"
        });
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};

// 🟢 4. Update User Profile (Dropdown-dakı inline edit üçün)
const updateProfile = async (req, res) => {
    try {
        const { full_name, phone_number, bio } = req.body;
        const userId = req.user.id;

        // Diqqət: Əgər userModel daxilində hazır update funksiyan yoxdursa, 
        // birbaşa verilənlər bazasına sorğu göndərən model funksiyasını çağırırıq
        await User.updateProfileData(userId, { full_name, phone_number, bio });

        res.json({ 
            message: "Profile synchronized successfully", 
            full_name, 
            phone_number, 
            bio 
        });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        res.status(500).json({ message: "Server error updating profile", error: error.message });
    }
};

// CRITICAL: Bütün funksiyaları bura əlavə edirik!
module.exports = { registerUser, loginUser, getProfile, updateProfile };