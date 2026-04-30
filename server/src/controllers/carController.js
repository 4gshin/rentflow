const Car = require('../models/carModel');

const getCars = async (req, res) => {
    try {
        const cars = await Car.getAllCars();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: "Xəta baş verdi", error });
    }
};

module.exports = { getCars };