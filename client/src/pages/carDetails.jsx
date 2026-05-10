import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

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
            toast.error("Please login to rent a car!", { style: { borderRadius: '15px' } });
            navigate('/login');
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select both dates!", { style: { borderRadius: '15px' } });
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

            toast.success('Reservation confirmed! Enjoy the ride.', {
                style: { background: '#1D1D1F', color: '#fff', borderRadius: '15px', fontWeight: 'bold' }
            });
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed.");
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
                <div className="flex-1 w-full">
                    <div className="aspect-square bg-[#F5F5F7] rounded-[3rem] flex items-center justify-center overflow-hidden border border-gray-50 shadow-inner">
                        <span className="text-gray-200 font-black text-6xl uppercase tracking-tighter opacity-40 italic">{car.brand}</span>
                    </div>
                </div>
                
                <div className="flex-1 w-full space-y-12">
                    <div className="space-y-4">
                        <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]">{car.category} Tier</span>
                        <h1 className="text-7xl font-black tracking-tighter text-[#1D1D1F]">
                            {car.brand} <span className="text-gray-300">{car.model}</span>
                        </h1>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-xl space-y-10">
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
                                    <input type="date" className="w-full p-5 bg-[#F5F5F7] rounded-2xl outline-none font-bold focus:ring-2 focus:ring-black transition-all" onChange={(e) => setStartDate(e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Return</label>
                                    <input type="date" className="w-full p-5 bg-[#F5F5F7] rounded-2xl outline-none font-bold focus:ring-2 focus:ring-black transition-all" onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                            </div>

                            <button onClick={handleBooking} disabled={isSubmitting} className={`w-full py-6 rounded-[1.5rem] font-black text-xl transition-all duration-500 ${isSubmitting ? 'bg-gray-100 text-gray-400' : 'bg-[#1D1D1F] text-white hover:bg-[#0071E3]'}`}>
                                {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;