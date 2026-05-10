import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5002/api/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            
            toast.success(`Welcome back!`, {
                icon: '👋',
                style: { borderRadius: '15px', background: '#1D1D1F', color: '#fff' }
            });
            
            setTimeout(() => window.location.href = '/', 1500);
        } catch (error) {
            toast.error('Login failed. Check your credentials.', { style: { borderRadius: '15px' } });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h2 className="text-3xl font-black text-center mb-2 tracking-tighter">Sign In</h2>
                <p className="text-gray-500 text-center mb-8 font-medium">Manage your premium rentals.</p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input type="email" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button className="w-full bg-black text-white p-5 rounded-2xl font-black hover:bg-[#0071E3] transition-all shadow-lg">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;