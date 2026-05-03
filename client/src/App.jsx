import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarDetails from './pages/CarDetails';

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
      {/* Şəkildəki o dar çərçivəni və bənövşəyi linkləri bu klasslar yox edir */}
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col">
        
        {/* Navigation Bar */}
        <nav className="h-20 px-12 flex justify-between items-center bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
          <Link to="/" className="text-2xl font-black tracking-tighter text-black no-underline">
            RENTFLOW
          </Link>
          
          <div className="flex items-center gap-10">
            <Link to="/" className="nav-link">FLEET</Link>
            
            {token && (
              <Link to="/profile" className="nav-link">MY GARAGE</Link>
            )}
            
            {token ? (
              <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-gray-100 text-[#1D1D1F] text-[12px] font-bold rounded-full hover:bg-red-50 hover:text-red-600 transition-all uppercase tracking-widest"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="px-8 py-2.5 bg-[#0071E3] text-white text-[12px] font-bold rounded-full no-underline hover:bg-[#0077ED] transition shadow-lg shadow-blue-200 uppercase tracking-widest"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-none">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/car/:id" element={<CarDetails />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-100 bg-white text-center">
          <p className="text-[12px] text-gray-400 font-medium tracking-wide uppercase">
            © 2026 RentFlow. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;