import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [activeBookings, setActiveBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await axios.get('http://localhost:5002/api/bookings/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Saatı sıfırlayırıq ki, düzgün müqayisə getsin

                // 🔴 SMART FILTER: Yalnız statusu pending/approved olan VƏ bitmə tarixi bu gündən sonra olanları saxlayırıq
                const active = res.data.filter(b => {
                    const isPendingOrApproved = b.status === 'pending' || b.status === 'approved';
                    const isFutureRental = new Date(b.end_date) >= today;
                    return isPendingOrApproved && isFutureRental;
                });
                
                setActiveBookings(active);
            } catch (err) {
                console.error("Garage load error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveBookings();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
            <div className="text-xl font-black text-gray-200 animate-pulse uppercase tracking-[0.3em]">
                Loading Active Fleet...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFD] p-6 md:p-12 font-sans antialiased">
            <header className="max-w-5xl mx-auto mb-12 text-left">
                <h1 className="text-6xl font-black tracking-tighter text-black">My Garage.</h1>
                <p className="text-lg text-[#86868B] font-medium tracking-tight mt-2">Track your current premium driving sessions.</p>
            </header>

            <div className="max-w-5xl mx-auto space-y-6">
                {activeBookings.length > 0 ? (
                    activeBookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow duration-300">
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0071E3] block italic">Active Rental</span>
                                <h2 className="text-4xl font-black tracking-tighter text-[#1D1D1F]">
                                    {booking.brand} <span className="text-gray-300 font-medium ml-2">{booking.model}</span>
                                </h2>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight pt-1">
                                    ⏱️ {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                                </p>
                            </div>
                            
                            <div className="flex md:flex-col justify-between w-full md:w-auto items-center md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                                {/* 🟢 SƏNİN İSTƏDİYİN "OFFICE" STATUS BİDLİRİŞİ */}
                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                    booking.status === 'pending' 
                                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                    : 'bg-green-50 text-green-600 border-green-100'
                                }`}>
                                    {booking.status === 'pending' ? 'Visit Office to Approve' : booking.status}
                                </div>
                                <span className="text-3xl font-black text-black tracking-tighter">${booking.total_price}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="text-5xl mb-4 grayscale opacity-30">🏎️</div>
                        <p className="text-[#86868B] font-black text-xl uppercase tracking-tighter">No active rentals found.</p>
                        <p className="text-gray-400 text-xs font-medium mt-1">Your current driving sessions will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;