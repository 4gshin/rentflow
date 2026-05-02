import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await axios.get('http://localhost:5002/api/cars');
                setCars(res.data);
            } catch (error) {
                console.error("Error fetching cars:", error);
            }
        };
        fetchCars();
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Available Fleet</h1>
                <p className="text-gray-500 mt-2">Choose the best car for your next journey.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map(car => (
                    <div key={car.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="h-40 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center text-gray-400">
                            {/* We will add images later */}
                            No Image Available
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{car.brand} {car.model}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase">
                                {car.year}
                            </span>
                            <span className="text-gray-400 text-sm">{car.plate_number}</span>
                        </div>
                        
                        <div className="mt-8 flex justify-between items-center border-t pt-4">
                            <div>
                                <span className="text-2xl font-bold text-black">${car.daily_price}</span>
                                <span className="text-gray-500 text-sm"> / day</span>
                            </div>
                            <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition">
                                Rent Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;