import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await axios.get(`http://localhost:5002/api/cars/${id}`);
                setCar(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchCar();
    }, [id]);

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to rent a car!");
            navigate('/login');
            return;
        }

        if (!startDate || !endDate) {
            alert("Please select both dates!");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await axios.post('http://localhost:5002/api/bookings', {
                car_id: id,
                start_date: startDate,
                end_date: endDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(res.data.message);
            navigate('/profile');
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!car) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
            <div className="animate-pulse text-xl font-black text-gray-300 tracking-tighter uppercase">Loading Fleet Details...</div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-12 min-h-screen bg-[#FBFBFD]">
            <div className="flex flex-col lg:flex-row gap-20 items-start">
                
                {/* Visual Section */}
                <div className="flex-1 w-full">
                    <div className="aspect-square bg-[#F5F5F7] rounded-[3rem] flex items-center justify-center overflow-hidden border border-gray-50 shadow-inner">
                        <span className="text-gray-200 font-black text-6xl uppercase tracking-tighter opacity-40 italic">
                            {car.brand}
                        </span>
                    </div>
                    
                    <div className="mt-10 grid grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-white border border-gray-50 rounded-[2rem] shadow-sm transition-hover hover:shadow-md duration-300"></div>
                        ))}
                    </div>
                </div>
                
                {/* Interaction Section */}
                <div className="flex-1 w-full space-y-12">
                    <div className="space-y-4">
                        <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]">{car.category} Tier</span>
                        <h1 className="text-7xl font-black tracking-tighter text-[#1D1D1F]">
                            {car.brand} <span className="text-gray-300">{car.model}</span>
                        </h1>
                        <p className="text-xl text-[#86868B] font-medium tracking-tight">Experience pure performance and luxury.</p>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-xl shadow-gray-200/20 space-y-10">
                        <div className="flex justify-between items-end border-b border-gray-50 pb-8">
                            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Daily Rate</span>
                            <div className="text-right">
                                <span className="text-5xl font-black text-black">${car.price_per_day}</span>
                                <span className="text-[#86868B] font-bold ml-2">/day</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Pick-up</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-5 bg-[#F5F5F7] border-none rounded-2xl focus:ring-2 focus:ring-[#0071E3] focus:bg-white transition-all outline-none font-bold"
                                        onChange={(e) => setStartDate(e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Return</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-5 bg-[#F5F5F7] border-none rounded-2xl focus:ring-2 focus:ring-[#0071E3] focus:bg-white transition-all outline-none font-bold"
                                        onChange={(e) => setEndDate(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleBooking} 
                                disabled={isSubmitting}
                                className={`w-full py-6 rounded-[1.5rem] font-black text-xl transition-all duration-500 shadow-2xl shadow-blue-200/50
                                    ${isSubmitting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1D1D1F] text-white hover:bg-[#0071E3] active:scale-[0.98]'}`}
                            >
                                {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-12 px-6 text-[#86868B]">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest mb-1">Production</span>
                            <span className="text-black font-bold text-lg">{car.year}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest mb-1">Insurance</span>
                            <span className="text-black font-bold text-lg">Included</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;