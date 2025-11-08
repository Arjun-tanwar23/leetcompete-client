import logo from '/logo.jpg';
import { IoPersonCircle } from "react-icons/io5";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for mobile menu
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { serverURL } from '../App';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const isLoggedIn = !!userData;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutConfirm = async () => {
    try {
      const res = await axios.get(serverURL + '/auth/logout', { withCredentials: true });
      toast.success("Logged out successfully");
      window.location.reload();
      navigate('/');
    } catch (error) {
      toast.error("Logout failed");
    }
    setShowLogoutModal(false);
  };
  const handleLogoutCancel = () => setShowLogoutModal(false);

  // Reusable component for auth buttons to avoid repetition
  const AuthButtons = ({ isMobile = false }) => (
    <div className={`flex items-center gap-3 ${isMobile ? 'flex-col w-full' : ''}`}>
      {isLoggedIn ? (
        <>
          <Link 
            to="/profile"
            className={`flex items-center gap-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-all ${isMobile ? 'w-full justify-center' : ''}`}
          >
            <IoPersonCircle className="w-8 h-8" />
            <span className="font-medium">Profile</span>
          </Link>
          <button 
            className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all ${isMobile ? 'w-full' : ''}`} 
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className={`px-5 py-2 text-white hover:text-blue-400 font-medium transition-colors ${isMobile ? 'w-full text-center' : ''}`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all ${isMobile ? 'w-full text-center' : ''}`}
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-8 z-10 min-w-[320px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-white">Confirm Logout</h2>
            <p className="mb-6 text-zinc-300">Are you sure you want to logout?</p>
            <div className="flex gap-4">
              <button onClick={handleLogoutConfirm} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all">Logout</button>
              <button onClick={handleLogoutCancel} className="px-5 py-2 bg-zinc-700 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="relative">
                <img
                  alt="LeetCompete Logo"
                  src={logo}
                  className="w-12 h-12 rounded-lg transition-all group-hover:border-blue-400 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Leet
                </span>
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Compete
                </span>
              </h1>
            </Link>

            {/* Desktop Navigation Links (Centered) */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link to="/battle" className="text-zinc-300 hover:text-white transition-colors duration-200">
                Battle
              </Link>
              <Link to="/leaderboard" className="text-zinc-300 hover:text-white transition-colors duration-200">
                Leaderboard
              </Link>
              <Link to="/problems" className="text-zinc-300 hover:text-white transition-colors duration-200">
                Problems
              </Link>
            </div>

            {/* Desktop Auth Buttons (Right) */}
            <div className="hidden md:flex items-center gap-3">
              <AuthButtons isMobile={false} />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-zinc-300 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4 space-y-4">
            {/* Mobile Nav Links */}
            <Link to="/battle" className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">
              Battle
            </Link>
            <Link to="/leaderboard" className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">
              Leaderboard
            </Link>
            <Link to="/problems" className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800">
              Problems
            </Link>
            
            {/* Mobile Auth Buttons */}
            <div className="border-t border-zinc-700 pt-4">
              <AuthButtons isMobile={true} />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;