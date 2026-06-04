import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await axios.get('http://localhost:5002/api/bookings/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (err) {
                console.error("Profile load error:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
            <div className="text-xl font-black text-gray-200 animate-pulse uppercase tracking-[0.3em]">
                Authenticating Fleet...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFD] p-6 md:p-12 font-sans antialiased">
            <header className="max-w-6xl mx-auto mb-20 text-center md:text-left">
                <h1 className="text-7xl font-black tracking-tighter text-black mb-4">My Garage.</h1>
                <p className="text-xl text-[#86868B] font-medium tracking-tight">
                    {user?.full_name ? `Welcome back, ${user.full_name}.` : "Accessing your personal fleet."}
                </p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-50 flex flex-col justify-between group hover:scale-[1.01] transition-all duration-500">
                            <div className="flex justify-between items-start mb-12">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0071E3] block italic">Confirmed Rental</span>
                                    <h2 className="text-5xl font-black tracking-tighter text-[#1D1D1F] leading-tight">
                                        {booking.brand} <span className="text-gray-200 block">{booking.model}</span>
                                    </h2>
                                </div>
                                <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    booking.status === 'pending' 
                                    ? 'bg-yellow-50 text-yellow-600 border-yellow-100' 
                                    : 'bg-green-50 text-green-600 border-green-100'
                                }`}>
                                    {booking.status}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-50 flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest block">Investment</span>
                                    <span className="text-4xl font-black text-black tracking-tighter">${booking.total_price}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-tighter">
                                        {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-40 text-center bg-[#F5F5F7] rounded-[4rem] border-2 border-dashed border-gray-200">
                        <div className="text-6xl mb-6 grayscale opacity-20">🏎️</div>
                        <p className="text-[#86868B] font-black text-2xl uppercase tracking-tighter">Your garage is currently empty.</p>
                        <p className="text-gray-400 font-medium mt-2">Select a vehicle from our fleet to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;