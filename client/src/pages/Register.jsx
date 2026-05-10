import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5002/api/users/register', formData);
            toast.success("Account created! Let's get you signed in.", { style: { borderRadius: '15px' } });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h2 className="text-4xl font-black text-center mb-8 tracking-tighter uppercase">Join RentFlow</h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <input type="text" placeholder="Full Name" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email Address" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Create Password" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button className="w-full bg-black text-white p-5 rounded-2xl font-black hover:bg-[#0071E3] transition-all shadow-lg">Create Account</button>
                </form>
            </div>
        </div>
    );
};

export default Register;