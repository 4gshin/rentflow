import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = ['All', 'Economic', 'Comfort', 'Prestige', 'Premium', 'Luxury'];

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

    // Filterləmə məntiqi
    const filteredCars = activeCategory === 'All' 
        ? cars 
        : cars.filter(car => car.category === activeCategory);

    return (
        <div className="min-h-screen bg-[#FBFBFD] px-6">
            {/* Hero Section */}
            <header className="py-24 text-center">
                <h1 className="text-7xl font-black tracking-tighter text-[#1D1D1F] mb-6">
                    The Fleet.
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto tracking-tight">
                    Luxury meets performance. Select your tier and start the journey.
                </p>

                {/* 🏷️ Category Filter Tabs */}
                <div className="flex justify-center gap-3 mt-12 overflow-x-auto px-6 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 border ${
                                activeCategory === cat 
                                ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-2xl scale-105' 
                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Car Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
                {filteredCars.map(car => (
                    <div key={car.id} className="group bg-white rounded-[2.5rem] p-10 border border-gray-50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col justify-between relative overflow-hidden">
                        
                        {/* Tier Badge */}
                        <div className="absolute top-8 right-10">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                                {car.category}
                            </span>
                        </div>

                        {/* Visual Placeholder */}
                        <div className="h-44 bg-[#F5F5F7] rounded-3xl mb-10 flex items-center justify-center overflow-hidden">
                            <span className="text-[#D2D2D7] font-black text-4xl italic opacity-20 group-hover:scale-110 transition-transform duration-700">
                                {car.brand}
                            </span>
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
                                    {car.brand} <span className="block text-[#86868B] text-2xl font-medium">{car.model}</span>
                                </h2>
                                <span className="bg-gray-100 text-gray-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    {car.year}
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1 mb-10">
                                <span className="text-4xl font-black text-black">${car.price_per_day}</span>
                                <span className="text-[#86868B] text-sm font-bold tracking-tight">/day</span>
                            </div>
                        </div>

                        <Link 
                            to={`/car/${car.id}`}
                            className="w-full bg-[#1D1D1F] text-white py-5 rounded-2xl font-black text-center text-sm hover:bg-[#0071E3] transition-all duration-300 shadow-lg"
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