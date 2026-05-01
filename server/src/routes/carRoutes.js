const express = require('express');
const router = express.Router();
const { getCars } = require('../controllers/carController');
const { protect } = require('../middlewares/authMiddleware'); 

router.get('/', protect, getCars);

module.exports = router;