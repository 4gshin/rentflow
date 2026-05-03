import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="min-h-screen bg-[#FBFBFD] px-6">
            {/* Hero Section */}
            <header className="py-20 text-center">
                <h1 className="text-6xl font-black tracking-tighter text-[#1D1D1F] mb-4">
                    The Fleet.
                </h1>
                <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                    Experience the perfect blend of performance and luxury for your next journey.
                </p>
            </header>

            {/* Car Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                {cars.map(car => (
                    <div key={car.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col justify-between">
                        
                        {/* Image Placeholder - Bura sonra G20 şəkli qoyacağıq */}
                        <div className="h-48 bg-[#F5F5F7] rounded-3xl mb-8 flex items-center justify-center overflow-hidden">
                            <span className="text-gray-300 font-bold tracking-widest uppercase text-xs group-hover:scale-110 transition-transform duration-500">
                                {car.brand} {car.model} Image
                            </span>
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
                                    {car.brand} <span className="block text-gray-400 text-2xl">{car.model}</span>
                                </h2>
                                <span className="bg-blue-50 text-[#0071E3] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    {car.year}
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-bold text-black">${car.daily_price}</span>
                                <span className="text-gray-400 font-medium">/day</span>
                            </div>
                        </div>

                        {/* Rent Now Button - İndi artıq işləyir! */}
                        <Link 
                            to={`/car/${car.id}`}
                            className="w-full bg-[#1D1D1F] text-white py-5 rounded-2xl font-bold text-center hover:bg-[#0071E3] transition-colors duration-300 shadow-xl shadow-gray-200"
                        >
                            Rent Now
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;