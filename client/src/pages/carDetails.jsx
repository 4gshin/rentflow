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
            return;
        }

        if (!startDate || !endDate) {
            alert("Please select both dates!");
            return;
        }

        setIsSubmitting(true); // Loading state baslayir

        try {
            const res = await axios.post('http://localhost:5002/api/bookings', {
                car_id: id,
                start_date: startDate,
                end_date: endDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(res.data.message);
            navigate('/profile'); // Səhifəni yeniləmədən profilə getmək daha sürətlidir
        } catch (error) {
            console.error("Booking Error Detail:", error.response?.data);
            alert(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false); // Loading bitir
        }
    };

    if (!car) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
            <div className="animate-pulse text-xl font-medium text-gray-400">Loading Fleet Details...</div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen bg-[#FBFBFD]">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
                
                {/* Visual Section */}
                <div className="flex-1 w-full">
                    <div className="aspect-video bg-[#F5F5F7] rounded-[2.5rem] flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
                        <span className="text-gray-300 font-black tracking-widest uppercase text-sm">
                            {car.brand} {car.model} Preview
                        </span>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-white border border-gray-100 rounded-2xl shadow-sm"></div>
                        ))}
                    </div>
                </div>
                
                {/* Interaction Section */}
                <div className="flex-1 w-full space-y-10">
                    <div className="space-y-2">
                        <h1 className="text-6xl font-black tracking-tighter text-[#1D1D1F]">
                            {car.brand} <span className="text-gray-400">{car.model}</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium tracking-tight">Experience pure performance and luxury.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
                        <div className="flex justify-between items-end border-b border-gray-50 pb-6">
                            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Daily Rate</span>
                            <div className="text-right">
                                <span className="text-4xl font-black text-black">${car.daily_price}</span>
                                <span className="text-gray-400 font-medium ml-1">/day</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Pick-up</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-5 bg-[#F5F5F7] border-none rounded-2xl focus:ring-2 focus:ring-[#0071E3] focus:bg-white transition-all outline-none font-bold"
                                        onChange={(e) => setStartDate(e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-2">
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
                                className={`w-full py-6 rounded-2xl font-black text-xl transition-all duration-500 shadow-2xl shadow-blue-200/50 flex items-center justify-center
                                    ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1D1D1F] text-white hover:bg-[#0071E3] active:scale-[0.98]'}`}
                            >
                                {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-8 px-4 text-gray-400">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest">Year</span>
                            <span className="text-black font-bold">{car.year}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest">Plate</span>
                            <span className="text-black font-bold">{car.plate_number}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;