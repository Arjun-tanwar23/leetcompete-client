import logo from "/logo.jpg";
import { IoPersonCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { serverURL } from "../App";
import { toast } from "react-toastify";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const isLoggedIn = !!userData;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutConfirm = async () => {
    try {
      const res = await axios.get(serverURL + "/auth/logout", {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      window.location.reload();
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
    setShowLogoutModal(false);
  };
  const handleLogoutCancel = () => setShowLogoutModal(false);

  return (
    <>
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-8 z-10 min-w-[320px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Confirm Logout
            </h2>
            <p className="mb-6 text-zinc-300">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLogoutConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
              >
                Logout
              </button>
              <button
                onClick={handleLogoutCancel}
                className="px-5 py-2 bg-zinc-700 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <img
                  alt="LeetCompete Logo"
                  src={logo}
                  className="w-12 h-12 rounded-lg  transition-all group-hover:border-blue-400 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h1 className="text-2xl ms-2 font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  LeetCompete
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <button
                    className="md:flex items-center gap-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                    onClick={() => navigate("/profile")}
                  >
                    <IoPersonCircle className="w-8 h-8" />
                    <span className="font-medium">Profile</span>
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 text-white hover:text-blue-400 font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
