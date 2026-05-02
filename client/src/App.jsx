import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // Yeni əlavə olundu
import CarDetails from './pages/CarDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* Navigation Bar */}
        <nav className="p-6 flex justify-between items-center bg-white border-b border-gray-100 sticky top-0 z-50">
          <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition">
            RENTFLOW
          </Link>
          
          <div className="flex items-center space-x-6 font-medium text-sm">
            <Link to="/" className="hover:text-blue-600 transition">Fleet</Link>
            <Link to="/register" className="hover:text-blue-600 transition">Register</Link> {/* Yeni link */}
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-200"
            >
              Login
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-7xl mx-auto py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* Yeni route */}
            <Route path="/car/:id" element={<CarDetails />} />
          </Routes>
        </main>

        {/* Footer (Minimalist) */}
        <footer className="py-10 text-center text-gray-400 text-xs border-t border-gray-100 mt-20">
          © 2026 RENTFLOW. Built with Node.js & React.
        </footer>
      </div>
    </Router>
  );
}

export default App;