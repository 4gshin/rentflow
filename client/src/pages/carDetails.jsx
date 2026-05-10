import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker'; // Yeni
import "react-datepicker/dist/react-datepicker.css"; // Yeni
import { addDays, eachDayOfInterval } from 'date-fns'; // Tarix hesablaması üçün

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [bookedDates, setBookedDates] = useState([]); // Bron olunmuş tarixlər
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Maşın məlumatı
                const carRes = await axios.get(`http://localhost:5002/api/cars/${id}`);
                setCar(carRes.data);

                // Bu maşın üçün artıq mövcud olan bron tarixlərini çəkək
                // QEYD: Backend-də bunun üçün endpoint olmalıdır, yoxdursa ümumi bookings-dən filterlə
                const bookingsRes = await axios.get(`http://localhost:5002/api/bookings/car/${id}`);
                
                const dates = [];
                bookingsRes.data.forEach(booking => {
                    const range = eachDayOfInterval({
                        start: new Date(booking.start_date),
                        end: new Date(booking.end_date)
                    });
                    dates.push(...range);
                });
                setBookedDates(dates);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        if (!startDate || !endDate) { toast.error("Select dates!"); return; }

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5002/api/bookings', {
                car_id: id,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            }, { headers: { Authorization: `Bearer ${token}` } });

            toast.success('Reservation confirmed!');
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        } finally { setIsSubmitting(false); }
    };

    if (!car) return <div className="p-20 text-center font-black opacity-20 uppercase">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-12 min-h-screen bg-[#FBFBFD]">
            <div className="flex flex-col lg:row gap-20 items-start">
                {/* Visual Section (Eyni qalır) */}
                <div className="flex-1 w-full">
                    <div className="aspect-square bg-white rounded-[3.5rem] flex items-center justify-center border border-gray-100 shadow-2xl">
                         <span className="text-8xl italic font-black opacity-5">{car.brand}</span>
                    </div>
                </div>

                {/* Interaction Section */}
                <div className="flex-1 w-full space-y-10">
                    <div className="space-y-4">
                        <span className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{car.category}</span>
                        <h1 className="text-6xl font-black tracking-tighter">{car.brand} <span className="text-gray-300">{car.model}</span></h1>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-50 space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Modern DatePicker */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Period</label>
                                <div className="flex flex-col gap-4">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={new Date()}
                                        excludeDates={bookedDates}
                                        placeholderText="Pick-up Date"
                                        className="w-full p-5 bg-[#F5F5F7] rounded-2xl font-bold outline-none border-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate || new Date()}
                                        excludeDates={bookedDates}
                                        placeholderText="Return Date"
                                        className="w-full p-5 bg-[#F5F5F7] rounded-2xl font-bold outline-none border-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <button onClick={handleBooking} disabled={isSubmitting} className="w-full py-6 bg-black text-white rounded-3xl font-black text-xl hover:bg-blue-600 transition-all shadow-xl">
                            {isSubmitting ? 'Processing...' : `Reserve for $${car.price_per_day}/day`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;