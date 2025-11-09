import { useState } from "react";
import { FaUser, FaTrophy, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { BsFillPencilFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import MatchAnalysis from "../../pages/History";

// Mock data to simulate what comes from useUser()
const mockUserData = {
  _id: "67f89ab123cde456",
  name: "Mayank Kansal",
  description: "Full Stack Developer | MERN",
  email: "mayank.kansal@example.com",
  photoURL: "", // Will show initial
  createdAt: "2024-01-10T10:30:00Z",
  rating: 1250,
  // This is the new match history list
  matches: [
    {
      matchId: "abcd123",
      opponent: "CodeNinja",
      result: "Win",
      score: "250 pts",
      date: "2024-01-15",
    },
    {
      matchId: "xyz789",
      opponent: "SyntaxSlayer",
      result: "Loss",
      score: "100 pts",
      date: "2024-01-14",
    },
    {
      matchId: "qwe456",
      opponent: "AsyncMaster",
      result: "Win",
      score: "180 pts",
      date: "2024-01-13",
    },
  ],
};

function Profile() {
  const navigate = useNavigate();
  // const { userData } = useUser(); // Real
  const { userData } = { userData: mockUserData }; // Mock
  
  // State to manage which match analysis to show
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalBattles = userData?.matches?.length || 0;
  // This logic would be more complex in a real app
  const wins = userData?.matches?.filter((m) => m.result === "Win").length || 0;
  const losses = totalBattles - wins;
  const winRate =
    totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(0) : 0;

  return (
    <>
      <Navbar />

      <Tooltip
        id="my-tooltip"
        style={{
          backgroundColor: "#27272a",
          color: "#fff",
          borderRadius: "6px",
          padding: "6px 10px",
          fontSize: "0.85rem",
          border: "1px solid #3f3f46",
          zIndex: 9999,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white py-20 px-4 md:px-12 lg:px-20 relative overflow-visible">
        {/* Subtle grid lines */}
        <div className="fixed top-0 bottom-0 left-8 lg:left-16 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent z-10 pointer-events-none"></div>
        <div className="fixed top-0 bottom-0 right-8 lg:right-16 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent z-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto pt-10 relative z-20">
          {/* --- Main Profile Card --- */}
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-8 shadow-2xl mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Section - Profile Info */}
              <div className="flex-1 bg-zinc-900/50 rounded-xl p-6 border border-zinc-700 flex flex-col justify-center items-center">
                <div
                  className="w-24 h-24 border-2 border-zinc-600 bg-zinc-800 rounded-full flex items-center justify-center mb-4 relative cursor-pointer hover:border-zinc-500 transition-colors group"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Click to Edit Profile"
                  data-tooltip-place="top"
                  onClick={() => navigate("/edit-profile")}
                >
                  {userData?.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt={userData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : userData?.name ? (
                    <span className="text-white text-3xl font-bold uppercase">
                      {userData.name.charAt(0)}
                    </span>
                  ) : (
                    <FaUser className="text-white text-3xl" />
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-zinc-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <BsFillPencilFill className="text-white text-xs" />
                  </div>
                </div>

                {/* Username & Description with Edit Icon */}
                <div className="bg-zinc-800/70 rounded-lg p-4 mb-3 border border-zinc-700 w-full hover:bg-zinc-800 transition-colors relative group">
                  <p className="text-lg font-semibold pr-6">
                    {userData?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-zinc-300 pr-6">
                    {userData?.description || "No description provided"}
                  </p>
                  <BsFillPencilFill
                    className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors absolute top-4 right-4 group-hover:opacity-100 opacity-0 md:opacity-100"
                    onClick={() => navigate("/edit-profile")}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Edit Name/Description"
                  />
                </div>

                {/* Email */}
                <div className="bg-zinc-800/70 rounded-lg px-4 py-3 mb-4 border border-zinc-700 w-full">
                  <p className="text-sm text-zinc-300">
                    {userData?.email || "No email"}
                  </p>
                </div>

                {/* Join Date and Player ID */}
                <div className="space-y-1.5 text-sm text-zinc-400 text-center w-full">
                  <p>
                    <span className="font-medium text-zinc-300">Joined On:</span>{" "}
                    {formatDate(userData?.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-300">Player ID:</span>{" "}
                    {userData?._id?.slice(-10) || "N/A"}
                  </p>
                </div>
              </div>

              {/* Right Section - Stats */}
              <div className="flex-1 bg-zinc-900/50 rounded-xl p-6 border border-zinc-700 grid grid-rows-3 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Wins" value={wins} className="text-green-500" />
                  <StatCard label="Losses" value={losses} className="text-red-500" />
                </div>
                <StatCard label="Total Battles" value={totalBattles} />
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Win Rate" value={`${winRate}%`} className="text-blue-500" />
                  <StatCard label="Rating" value={userData?.rating || 100} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* --- NEW Match History Section --- */}
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-white">Match History</h2>
            <div className="space-y-4">
              {userData?.matches?.length > 0 ? (
                userData.matches.map((match) => (
                  <MatchHistoryItem
                    key={match.matchId}
                    match={match}
                    onView={() => setSelectedMatchId(match.matchId)}
                  />
                ))
              ) : (
                <p className="text-zinc-400 text-center py-4">
                  No matches played yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* --- Conditional Modal Render --- */}
      {selectedMatchId && (
        <MatchAnalysis
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </>
  );
}

// Helper component for Stats
const StatCard = ({ label, value, className = "text-white" }) => (
  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 text-center">
    <p className="text-sm text-zinc-400 mb-1">{label}</p>
    <p className={`text-2xl font-semibold ${className}`}>{value}</p>
  </div>
);

// Helper component for Match History List
const MatchHistoryItem = ({ match, onView }) => (
  <div className="bg-zinc-800/70 border border-zinc-700 rounded-xl p-4 shadow-lg transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-800">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex-1 text-center md:text-left">
        <p className="text-sm text-zinc-400">vs</p>
        <p className="text-lg font-semibold text-white">{match.opponent}</p>
      </div>
      <div
        className={`flex-1 font-semibold text-xl flex items-center justify-center gap-2 ${
          match.result === "Win" ? "text-green-500" : "text-red-500"
        }`}
      >
        {match.result === "Win" ? <FaTrophy /> : <FaTimes />}
        {match.result}
      </div>
      <div className="flex-1 text-center md:text-right">
        <p className="font-mono text-zinc-300">{match.score}</p>
        <p className="text-sm text-zinc-400">{formatDate(match.date)}</p>
      </div>
      <div className="w-full md:w-auto">
        <button
          onClick={onView}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-md"
        >
          View Analysis
        </button>
      </div>
    </div>
  </div>
);

// Helper function (needed by MatchHistoryItem)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default Profile;