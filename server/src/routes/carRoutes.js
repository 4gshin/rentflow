const express = require('express');
const router = express.Router();
const { getAllCars, addCar } = require('../controllers/carController');
const { protect, isAdmin } = require('../middlewares/authMiddleware'); 

router.get('/', getAllCars);

router.post('/', protect, isAdmin, addCar);

module.exports = router;