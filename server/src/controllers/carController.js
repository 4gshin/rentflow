const db = require('../config/db');

// 1. Bütün maşınları gətir (Fleet səhifəsi üçün)
exports.getAllCars = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM cars');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cars", error: error.message });
    }
};

// 2. Tək bir maşını ID-yə görə gətir (Səndə çatmayan hissə buydu!)
exports.getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM cars WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Car not found in our fleet" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Database error", error: error.message });
    }
};

// 3. Yeni maşın əlavə et (Yalnız Adminlər üçün)
exports.addCar = async (req, res) => {
    try {
        const { brand, model, year, daily_price, plate_number } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO cars (brand, model, year, daily_price, plate_number) VALUES (?, ?, ?, ?, ?)',
            [brand, model, year, daily_price, plate_number]
        );

        res.status(201).json({ 
            message: "Car added successfully!", 
            carId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ message: "Could not add car", error: error.message });
    }
};