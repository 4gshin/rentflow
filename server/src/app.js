const express = require('express');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes'); // 1. Import et

const app = express();

app.use(cors());
app.use(express.json());

// 2. API yollarını təyin et
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/bookings', bookingRoutes); // Bura əlavə olundu

module.exports = app;