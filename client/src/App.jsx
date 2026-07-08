import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
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
  
  // Edit State-ləri
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Dropdown açılanda canlı məlumatları çəkirik
  useEffect(() => {
    if (dropdownOpen && token) {
      fetchProfileData();
    } else {
      setIsEditing(false); // Dropdown bağlananda edit rejimindən çıxırıq
    }
  }, [dropdownOpen, token]);

  const fetchProfileData = async () => {
    try {
      const profRes = await axios.get('http://localhost:5002/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(profRes.data);
      // Edit formunu doldururuq
      setEditName(profRes.data.full_name || '');
      setEditPhone(profRes.data.phone_number || '');
      setEditBio(profRes.data.bio || '');
    } catch (err) {
      console.error("Dropdown profile data error:", err);
    }
  };

  // İnline Profil Yeniləmə Logikası
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5002/api/users/profile', {
        full_name: editName,
        phone_number: editPhone,
        bio: editBio
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Profile synchronized!");
      setIsEditing(false);
      
      // Lokal state-ləri yeniləyirik
      const updatedUser = { ...user, full_name: editName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      fetchProfileData();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to sync changes.");
    }
  };

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

  return (
    <Router>
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col font-sans antialiased relative">
        <Toaster position="top-right" reverseOrder={false} />
        
        <nav className="h-16 px-6 md:px-12 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
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

            {/* 💳 PREMIUM FACE CARD DROPDOWN W/ INLINE EDIT */}
            {dropdownOpen && (
              <div className="absolute right-0 top-14 w-80 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 z-50 flex flex-col space-y-5 animate-in fade-in slide-in-from-top-3 duration-200">
                
                {!isEditing ? (
                  /* 👁️ VIEW MODE: Məlumatların Göstərilməsi */
                  <>
                    <div className="pb-4 border-b border-gray-50 flex flex-col space-y-0.5">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#0071E3]">Driver Identity</span>
                      <h4 className="text-xl font-black tracking-tight text-[#1D1D1F]">{profileData?.full_name || user?.full_name}</h4>
                      <p className="text-xs text-gray-400 font-medium tracking-tight">{profileData?.email || user?.email}</p>
                    </div>

                    <div className="space-y-3 text-xs text-[#1D1D1F]">
                      <div className="bg-[#F5F5F7] px-4 py-3 rounded-2xl border border-gray-50">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-0.5">Phone Line</span>
                        <p className="font-bold">{profileData?.phone_number || "No contact line synced"}</p>
                      </div>
                      <div className="bg-[#F5F5F7] px-4 py-3 rounded-2xl border border-gray-50">
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-0.5">Driver Bio</span>
                        <p className="italic font-medium text-gray-600">"{profileData?.bio || "Premium Driver"}"</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-2 bg-[#1D1D1F] text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#0071E3] transition-all duration-300"
                    >
                      Settings / Edit
                    </button>
                  </>
                ) : (
                  /* 📝 EDIT MODE: İnline Forma Keçid */
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="pb-2 border-b border-gray-50">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#0071E3]">Modify Account</span>
                      <h4 className="text-md font-black tracking-tight text-[#1D1D1F]">Inline Settings</h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-1">Full Name</label>
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-[#F5F5F7] border border-transparent focus:border-gray-200 outline-none p-3 rounded-xl text-xs font-bold text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+994 (XX) XXX-XX-XX"
                          className="w-full bg-[#F5F5F7] border border-transparent focus:border-gray-200 outline-none p-3 rounded-xl text-xs font-bold text-black"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-1">Bio Description</label>
                        <textarea 
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="w-full bg-[#F5F5F7] border border-transparent focus:border-gray-200 outline-none p-3 rounded-xl text-xs font-medium text-gray-700 h-16 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="w-1/2 bg-gray-100 text-gray-500 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="w-1/2 bg-[#0071E3] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

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