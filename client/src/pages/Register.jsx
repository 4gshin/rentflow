import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5002/api/users/register', formData);
            alert("Account created! Now you can login.");
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center mb-8 font-sans uppercase tracking-tighter">Join RentFlow</h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                           onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                           onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                           onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button className="w-full bg-black text-white p-4 rounded-xl font-bold hover:opacity-90 transition">Create Account</button>
                </form>
            </div>
        </div>
    );
};

export default Register;