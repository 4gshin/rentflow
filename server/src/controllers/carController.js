const db = require('../config/db'); 

const getAllCars = async (req, res) => {
    try {
        const [cars] = await db.execute('SELECT * FROM cars');
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: "Maşınlar gətirilərkən xəta baş verdi", error: error.message });
    }
};

const addCar = async (req, res) => {
    try {
        const { brand, model, year, plate_number, daily_price, status } = req.body;

        const [result] = await db.execute(
            'INSERT INTO cars (brand, model, year, plate_number, daily_price, status) VALUES (?, ?, ?, ?, ?, ?)',
            [brand, model, year, plate_number, daily_price, status || 'available']
        );

        res.status(201).json({ 
            message: "Yeni maşın uğurla əlavə edildi!", 
            carId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ message: "Maşın əlavə edilərkən xəta baş verdi", error: error.message });
    }
};

module.exports = { getAllCars, addCar };