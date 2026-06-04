import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Profil inputları üçün state-lər
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [phone, setPhone] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);

    // Adın baş hərflərindən dinamik Monoqram (Avatar) yaratmaq üçün funksiya
    const getInitials = (name) => {
        if (!name) return "RF";
        const parts = name.trim().split(" ");
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    useEffect(() => {
        const fetchProfileAndBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                // 1. İstifadəçinin profil məlumatlarını çəkirik
                const profileRes = await axios.get('http://localhost:5002/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // State-ləri doldururuq
                setFullName(profileRes.data.full_name);
                setBio(profileRes.data.bio || "Premium Driver");
                setPhone(profileRes.data.phone_number || "");

                // 2. İstifadəçinin qarajındakı maşınları çəkirik
                const bookingsRes = await axios.get('http://localhost:5002/api/bookings/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(bookingsRes.data);

            } catch (err) {
                console.error("Profile load error:", err.response?.data || err.message);
                toast.error("Məlumatlar yüklənərkən xəta baş verdi");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndBookings();
    }, []);

    // Profil məlumatlarını yeniləmək funksiyası
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setUpdateLoading(true);
            const token = localStorage.getItem('token');
            
            const res = await axios.put('http://localhost:5002/api/users/profile', 
                { full_name: fullName, bio: bio, phone_number: phone },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // LocalStorage-da olan user obyektini də sinxron yeniləyirik ki, Navbarda ad dərhal dəyişsin
            const localUser = JSON.parse(localStorage.getItem('user')) || {};
            localUser.full_name = fullName;
            localStorage.setItem('user', JSON.stringify(localUser));

            toast.success("Profile saved with success.");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Yenilənmə zamanı xəta");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
            <div className="text-xl font-black text-gray-200 animate-pulse uppercase tracking-[0.3em]">
                Syncing Personal Fleet...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFD] p-6 md:p-12 font-sans antialiased">
            <header className="max-w-7xl mx-auto mb-16 text-left">
                <h1 className="text-6xl font-black tracking-tighter text-black">Dashboard.</h1>
                <p className="text-lg text-[#86868B] font-medium tracking-tight mt-2">Manage your luxury identity and active rentals.</p>
            </header>

            {/* Grid Layout: Sol tərəf Face Card, Sağ tərəf Garage */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                
                {/* 💳 SOL HİSSƏ: PREMIUM FACE CARD */}
                <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-50 flex flex-col space-y-8 sticky top-24">
                    
                    {/* Visual Monoqram Header */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                        <div className="w-20 h-20 bg-[#1D1D1F] text-white flex items-center justify-center rounded-full text-2xl font-black tracking-tighter shadow-lg">
                            {getInitials(fullName)}
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0071E3] block">Verified Account</span>
                            <h2 className="text-2xl font-black tracking-tight text-[#1D1D1F]">{fullName}</h2>
                            <p className="text-xs text-gray-400 font-medium italic mt-0.5">"{bio}"</p>
                        </div>
                    </div>

                    {/* İnput Formu */}
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">Full Name</label>
                            <input 
                                type="text" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-[#F5F5F7] text-black text-sm font-semibold p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#0071E3] transition-all"
                                placeholder="Driver Name"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">Driver Bio</label>
                            <input 
                                type="text" 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-[#F5F5F7] text-black text-sm font-semibold p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#0071E3] transition-all"
                                placeholder="e.g. BMW Enthusiast"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pl-1">Phone Identity</label>
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-[#F5F5F7] text-black text-sm font-semibold p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#0071E3] transition-all"
                                placeholder="+994 -- --- -- --"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={updateLoading}
                            className="w-full bg-[#1D1D1F] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0071E3] transition-all duration-300 shadow-md disabled:opacity-50"
                        >
                            {updateLoading ? "Saving..." : "Save Identity"}
                        </button>
                    </form>
                </div>

                {/* 🏎️ SAĞ HİSSƏ: MY GARAGE */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-1 gap-8">
                    <div className="mb-2 pl-2">
                        <h3 className="text-3xl font-black tracking-tighter text-black">My Garage.</h3>
                        <p className="text-sm text-gray-400 font-medium">Your active premium rentals.</p>
                    </div>

                    {bookings.length > 0 ? (
                        bookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-[2.5rem] p-8 shadow-md border border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:scale-[1.01] transition-all duration-500">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0071E3] block italic">Confirmed Rental</span>
                                    <h2 className="text-4xl font-black tracking-tighter text-[#1D1D1F]">
                                        {booking.brand} <span className="text-gray-200 block md:inline md:ml-2">{booking.model}</span>
                                    </h2>
                                    <p className="text-[11px] font-bold text-gray-300 uppercase tracking-tighter pt-1">
                                        {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                <div className="flex md:flex-col justify-between w-full md:w-auto items-center md:items-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        booking.status === 'pending' 
                                        ? 'bg-yellow-50 text-yellow-600 border-yellow-100' 
                                        : 'bg-green-50 text-green-600 border-green-100'
                                    }`}>
                                        {booking.status}
                                    </div>
                                    <span className="text-3xl font-black text-black tracking-tighter">${booking.total_price}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-32 text-center bg-[#F5F5F7] rounded-[3rem] border-2 border-dashed border-gray-200">
                            <div className="text-5xl mb-4 grayscale opacity-20">🏎️</div>
                            <p className="text-[#86868B] font-black text-xl uppercase tracking-tighter">Your garage is currently empty.</p>
                            <p className="text-gray-400 text-xs font-medium mt-1">Select a vehicle from our fleet to start.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;