const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
// Authentication
router.post('/register', registerUser);
router.post('/login', loginUser); 

// 🟢 Profile Operations (İnline settings və məlumatların oxunması)
router.get('/profile', protect, getProfile);  // Profil məlumatlarını çəkmək üçün
router.put('/profile', protect, updateProfile);  // Profil məlumatlarını yeniləmək üçün

module.exports = router;