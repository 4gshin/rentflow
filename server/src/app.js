const express = require('express');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');

const app = express(); 
app.use(cors());
app.use(express.json());

app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/bookings', bookingRoutes); 

module.exports = app;