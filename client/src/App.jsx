import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarDetails from './pages/CarDetails';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Token deyişende interfeysi yenilemek üçün
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#FBFBFD] font-sans text-[#1D1D1F]">
        <nav className="px-10 py-5 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <Link to="/" className="text-2xl font-black tracking-tighter text-black">
            RENTFLOW
          </Link>
          
          <div className="flex items-center space-x-10 font-medium text-[13px] tracking-wide">
            <Link to="/" className="hover:text-blue-600 transition">FLEET</Link>
            {token && <Link to="/profile" className="hover:text-blue-600 transition">MY GARAGE</Link>}
            
            {token ? (
              <button 
                onClick={handleLogout}
                className="px-5 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="px-6 py-2 bg-[#0071E3] text-white rounded-full hover:bg-[#0077ED] transition shadow-md shadow-blue-100"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-12 px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/car/:id" element={<CarDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;