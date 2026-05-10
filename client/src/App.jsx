import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'; // Əlavə olundu
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarDetails from './pages/CarDetails';
import About from './pages/About';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

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
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col font-sans antialiased">
        {/* Toast Bildirişləri üçün konteyner */}
        <Toaster position="top-right" reverseOrder={false} />
        
        <nav className="h-16 px-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-xl font-black tracking-tighter text-black no-underline hover:opacity-70 transition-opacity">
              RENTFLOW
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-[12px] font-bold text-[#1D1D1F] no-underline tracking-widest uppercase hover:text-[#0071E3] transition-colors">
                Fleet
              </Link>
              <Link to="/about" className="text-[12px] font-bold text-[#1D1D1F] no-underline tracking-widest uppercase hover:text-[#0071E3] transition-colors">
                About
              </Link>
              {token && (
                <Link to="/profile" className="text-[12px] font-bold text-[#1D1D1F] no-underline tracking-widest uppercase hover:text-[#0071E3] transition-colors">
                  My Garage
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {token ? (
              <button 
                onClick={handleLogout}
                className="px-5 py-2 bg-red-50 text-red-600 text-[10px] font-black rounded-full hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-4">
                 <Link to="/login" className="text-[11px] font-black text-gray-400 no-underline uppercase tracking-widest hover:text-black">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-[#1D1D1F] text-white text-[11px] font-black rounded-full no-underline hover:bg-[#0071E3] transition shadow-lg uppercase tracking-widest"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/car/:id" element={<CarDetails />} />
          </Routes>
        </main>

        <footer className="py-20 bg-white border-t border-gray-100 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left">
              <h2 className="text-2xl font-black tracking-tighter mb-2">RENTFLOW</h2>
              <p className="text-sm text-gray-400 font-medium">The future of premium car rentals.</p>
            </div>
            <div className="flex gap-10 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <Link to="/" className="hover:text-black no-underline">Fleet</Link>
              <Link to="/about" className="hover:text-black no-underline">About</Link>
              <span className="cursor-default">Privacy</span>
            </div>
            <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">© 2026 RentFlow Studio.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;