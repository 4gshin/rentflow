import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchCar = async () => {
            const res = await axios.get(`http://localhost:5002/api/cars/${id}`);
            setCar(res.data);
        };
        fetchCar();
    }, [id]);

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Please login first!");

        try {
            await axios.post('http://localhost:5002/api/bookings', {
                car_id: id,
                start_date: startDate,
                end_date: endDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Booking successful!");
        } catch (error) {
            alert(error.response?.data?.message || "Booking failed");
        }
    };

    if (!car) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8 flex flex-col md:flex-row gap-12">
            <div className="flex-1 bg-gray-200 h-96 rounded-3xl flex items-center justify-center text-gray-500">
                Large Image of {car.brand} {car.model}
            </div>
            
            <div className="flex-1 space-y-6">
                <h1 className="text-5xl font-black">{car.brand} {car.model}</h1>
                <p className="text-2xl font-semibold text-blue-600">${car.daily_price} / day</p>
                
                <div className="grid grid-cols-2 gap-4 pt-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Pick-up Date</label>
                        <input type="date" className="w-full p-4 bg-white border border-gray-200 rounded-xl" 
                               onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Return Date</label>
                        <input type="date" className="w-full p-4 bg-white border border-gray-100 rounded-xl" 
                               onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>

                <button onClick={handleBooking} className="w-full bg-black text-white p-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition">
                    Confirm Rental
                </button>
            </div>
        </div>
    );
};

export default CarDetails;