const db = require('../config/db');

const Car = {
    getAllCars: async () => {
        const [rows] = await db.query('SELECT * FROM cars');
        return rows;
    }
};

module.exports = Car;