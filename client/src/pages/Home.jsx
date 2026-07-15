import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const categories = ['All', 'Economic', 'Comfort', 'Prestige', 'Premium', 'Luxury'];
    
    // Smooth scroll üçün referans nöqtəsi
    const fleetRef = useRef(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5002/api/cars');
                if (res.data && Array.isArray(res.data)) {
                    setCars(res.data);
                } else {
                    setErrorMessage("Data format error from backend.");
                }
            } catch (error) {
                console.error("Error fetching cars:", error);
                setErrorMessage("Backend serverinə bağlanmaq mümkün olmadı! Port 5002-ni və ya SQL-i yoxla.");
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    const scrollToFleet = () => {
        fleetRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const filteredCars = activeCategory === 'All' 
        ? cars 
        : cars.filter(car => car.category === activeCategory);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
            <div className="text-xl font-black text-gray-300 animate-pulse uppercase tracking-[0.2em]">
                Loading RentFlow Fleet...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFD]">
            
            <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden bg-gradient-to-b from-white via-[#FBFBFD] to-[#F5F5F7]">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0071E3] block animate-fade-in">
                        The Future of Premium Rentals
                    </span>
                    <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-[#1D1D1F] leading-[0.95]">
                        Move like <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-black via-[#1D1D1F] to-gray-500">tomorrow.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400 font-medium max-w-xl mx-auto tracking-tight pt-2">
                        Impeccable engineering. Zero friction. Access our exclusive collection of tier-one vehicles.
                    </p>
                    <div className="pt-8">
                        <button 
                            onClick={scrollToFleet}
                            className="px-10 py-5 bg-[#1D1D1F] text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-[#0071E3] hover:scale-105 transition-all duration-500 ease-in-out shadow-xl"
                        >
                            Explore the Fleet
                        </button>
                    </div>
                </div>

                {/* Aşağı sürüşmə işarəsi */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-40 hover:opacity-100 transition-opacity" onClick={scrollToFleet}>
                    <svg className="w-5 h-5 text-black" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </section>

            <div ref={fleetRef} className="px-6 max-w-7xl mx-auto pt-20">
                {errorMessage && (
                    <div className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl text-center font-bold text-sm">
                        ⚠️ {errorMessage}
                    </div>
                )}

                <header className="py-16 text-center">
                    <h2 className="text-5xl font-black tracking-tighter text-[#1D1D1F] mb-4">The Fleet.</h2>
                    <p className="text-md text-gray-400 font-medium max-w-md mx-auto tracking-tight">
                        Select your structural tier and start the dynamic journey.
                    </p>

                    <div className="flex justify-center gap-3 mt-10 overflow-x-auto px-6 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 border ${
                                    activeCategory === cat 
                                    ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-xl scale-105' 
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
                    {filteredCars.length > 0 ? (
                        filteredCars.map(car => (
                            <div key={car.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-6 right-8">
                                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                                        {car.category}
                                    </span>
                                </div>

                                <div className="h-40 bg-[#F5F5F7] rounded-3xl mb-8 flex items-center justify-center overflow-hidden">
                                    <span className="text-[#D2D2D7] font-black text-3xl italic opacity-25 group-hover:scale-110 transition-transform duration-700">
                                        {car.brand}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex justify-between items-start mb-5">
                                        <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                                            {car.brand} <span className="block text-[#86868B] text-xl font-medium">{car.model}</span>
                                        </h3>
                                        <span className="bg-gray-100 text-gray-400 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                            {car.year}
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-3xl font-black text-black">${car.price_per_day}</span>
                                        <span className="text-[#86868B] text-xs font-bold tracking-tight">/day</span>
                                    </div>
                                </div>

                                <Link 
                                    to={`/car/${car.id}`}
                                    className="w-full bg-[#1D1D1F] text-white py-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest hover:bg-[#0071E3] transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Rent Now
                                </Link>
                            </div>
                        ))
                    ) : (
                        !loading && (
                            <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                No vehicles available in this tier.
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;