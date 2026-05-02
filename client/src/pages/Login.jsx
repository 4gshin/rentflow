import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5002/api/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            alert('Welcome back, Agshin!'); // We will replace this with a better notification later
            window.location.href = '/';
        } catch (error) {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center mb-2">Sign In</h2>
                <p className="text-gray-500 text-center mb-8">Enter your details to manage your rentals.</p>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="agshin@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;