import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import axios from 'react-hot-toast'; 
import axiosActual from 'axios'; // Real axios instansiyası
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarDetails from './pages/CarDetails';
import About from './pages/About';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [pastBookings, setPastBookings] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (dropdownOpen && token) {
      const fetchDropdownData = async () => {
        try {
          const profRes = await axiosActual.get('http://localhost:5002/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfileData(profRes.data);

          const bookRes = await axiosActual.get('http://localhost:5002/api/bookings/my', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // 🔴 SMART FILTER: Statusu completed/rejected olanlar VƏ YA tarixi artıq keçmiş olan bütün rentləri bura yığırıq
          const past = bookRes.data.filter(b => {
            const isFinishedStatus = b.status === 'completed' || b.status === 'rejected';
            const isPastDate = new Date(b.end_date) < today;
            return isFinishedStatus || isPastDate;
          });
          
          setPastBookings(past);
        } catch (err) {
          console.error("Dropdown data error:", err);
        }
      };
      fetchDropdownData();
    }
  }, [dropdownOpen, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setDropdownOpen(false);
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    if (!name) return "RF";
    const parts = name.trim().split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col font-sans antialiased relative">
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
          
          <div className="flex items-center gap-6 relative" ref={dropdownRef}>
            {token ? (
              <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black rounded-full hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">
                  Logout
                </button>
                
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 bg-[#1D1D1F] text-white rounded-full flex items-center justify-center font-black text-xs border border-gray-200 shadow-sm hover:scale-105 transition-transform"
                >
                  {getInitials(profileData?.full_name || user?.full_name)}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                 <Link to="/login" className="text-[11px] font-black text-gray-400 no-underline uppercase tracking-widest hover:text-black">
                  Sign In
                </Link>
                <Link to="/register" className="px-6 py-2 bg-[#1D1D1F] text-white text-[11px] font-black rounded-full no-underline hover:bg-[#0071E3] transition shadow-lg uppercase tracking-widest">
                  Sign Up
                </Link>
              </div>
            )}

            {/* 💳 FACE CARD DROPDOWN */}
            {dropdownOpen && (
              <div className="absolute right-0 top-14 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 z-50 flex flex-col space-y-5 animate-in fade-in slide-in-from-top-3 duration-200">
                
                <div className="pb-3 border-b border-gray-50 flex flex-col space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#0071E3]">Premium Member</span>
                  <h4 className="text-lg font-black tracking-tight text-[#1D1D1F]">{profileData?.full_name || user?.full_name}</h4>
                  <p className="text-xs text-gray-400 font-medium tracking-tight">{profileData?.email || user?.email}</p>
                </div>

                <div className="flex flex-col space-y-3">
                  <h5 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Past Rentals</h5>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                    {pastBookings.length > 0 ? (
                      pastBookings.map(book => (
                        <div key={book.id} className="bg-[#F5F5F7] px-4 py-3 rounded-2xl flex justify-between items-center border border-gray-50">
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-[#1D1D1F]">{book.brand} <span className="font-medium text-gray-500">{book.model}</span></p>
                            <p className="text-[10px] font-semibold text-gray-400">
                              {formatDate(book.start_date)} — {formatDate(book.end_date)}
                            </p>
                          </div>
                          <span className="text-xs font-black text-black bg-white px-2.5 py-1 rounded-lg border border-gray-100">${book.total_price}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-medium text-gray-300 italic text-center py-4">No history records.</p>
                    )}
                  </div>
                </div>

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
      </div>
    </Router>
  );
}

export default App;