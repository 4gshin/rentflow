const express = require('express');
const router = express.Router();
const { getAllCars, addCar, getCarById } = require('../controllers/carController'); 
const { protect, isAdmin } = require('../middlewares/authMiddleware'); 

router.get('/', getAllCars);
router.get('/:id', getCarById); 

router.post('/', protect, isAdmin, addCar);

module.exports = router;