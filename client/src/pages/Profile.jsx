import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5002/api/bookings/my-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (error) {
                console.error("Profile error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    if (loading) return <div className="p-10 text-center font-medium">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase">My Garage</h1>
            
            <div className="space-y-4">
                {bookings.length > 0 ? bookings.map((b) => (
                    <div key={b.id} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">{b.brand} {b.model}</h3>
                            <p className="text-gray-400 text-sm font-medium">
                                {new Date(b.start_date).toLocaleDateString()} — {new Date(b.end_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                                b.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {b.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">You haven't rented any cars yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;