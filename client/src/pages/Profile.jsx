import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [bookings, setBookings] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMyBookings = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5002/api/bookings/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        };
        fetchMyBookings();
    }, []);

    return (
        <div className="min-h-screen bg-[#FBFBFD] p-12">
            <header className="max-w-6xl mx-auto mb-20">
                <h1 className="text-7xl font-black tracking-tighter text-black mb-4">My Garage.</h1>
                <p className="text-xl text-gray-400 font-medium tracking-tight">Welcome back, {user?.full_name || 'Driver'}. Here are your active rentals.</p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {bookings.map(booking => (
                    <div key={booking.id} className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-50 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-500">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 block">Rental Ticket</span>
                                <h2 className="text-4xl font-black tracking-tighter">{booking.brand} <span className="text-gray-300">{booking.model}</span></h2>
                            </div>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                booking.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                            }`}>
                                {booking.status}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between border-b border-gray-50 pb-4">
                                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Period</span>
                                <span className="font-bold text-sm">
                                    {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Total Paid</span>
                                <span className="text-3xl font-black text-black">${booking.total_price}</span>
                            </div>
                        </div>

                        <button className="mt-10 w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                            Cancel Reservation
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;