import { useState } from "react";
import { FaTrophy, FaTimes, FaCheck } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function History() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchHistory] = useState([
    {
      matchId: "abcd123",
      opponent: "Opponent Username",
      problemsSolved: "3/5",
      result: "Win",
      date: "2024-01-15",
      duration: 90, // in minutes
      points: "12/15",
      problems: [
        { name: "Two Sum", solved: true, difficulty: "Easy" },
        { name: "Add Two Numbers", solved: true, difficulty: "Medium" },
        { name: "Longest Substring", solved: true, difficulty: "Medium" },
        {
          name: "Median of Two Sorted Arrays",
          solved: false,
          difficulty: "Hard",
        },
        { name: "Reverse Integer", solved: false, difficulty: "Easy" },
      ],
    },
    {
      matchId: "xyz789",
      opponent: "Another Player",
      problemsSolved: "2/5",
      result: "Loss",
      date: "2024-01-14",
      duration: 120, // in minutes
      points: "8/15",
      problems: [
        { name: "Valid Parentheses", solved: true, difficulty: "Easy" },
        { name: "Merge Two Sorted Lists", solved: true, difficulty: "Easy" },
        {
          name: "Container With Most Water",
          solved: false,
          difficulty: "Medium",
        },
        { name: "3Sum", solved: false, difficulty: "Medium" },
        { name: "Binary Tree Traversal", solved: false, difficulty: "Medium" },
      ],
    },
    {
      matchId: "def456",
      opponent: "CodeMaster99",
      problemsSolved: "4/5",
      result: "Win",
      date: "2024-01-13",
      duration: 60, // in minutes
      points: "13/15",
      problems: [
        { name: "Search Insert Position", solved: true, difficulty: "Easy" },
        { name: "Maximum Subarray", solved: true, difficulty: "Medium" },
        { name: "Climbing Stairs", solved: true, difficulty: "Easy" },
        { name: "Merge Sorted Array", solved: true, difficulty: "Easy" },
        { name: "Best Time to Buy Stock", solved: false, difficulty: "Easy" },
      ],
    },
    // Add more mock matches as needed
  ]);

  const handleViewDetails = (match) => {
    setSelectedMatch(match);
  };

  const handleCloseModal = () => {
    setSelectedMatch(null);
  };

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return "N/A";
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${mins} min`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white py-20 px-4 md:px-12 lg:px-20 relative">
        {/* Vertical Grid Lines */}
        <div className="fixed top-0 bottom-0 left-8 lg:left-16 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent z-10"></div>
        <div className="fixed top-0 bottom-0 right-8 lg:right-16 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent z-10"></div>

        <div className="max-w-4xl mx-auto pt-10">
          {/* Header */}
          <h1 className="text-4xl font-bold mb-8 text-white text-center">
            Previous Matches
          </h1>

          {/* Match History List */}
          <div className="space-y-6">
            {matchHistory.length === 0 ? (
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-12 text-center">
                <p className="text-zinc-400 text-lg">No match history yet</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Start battling to see your match history!
                </p>
              </div>
            ) : (
              matchHistory.map((match, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-6 shadow-lg hover:border-zinc-600 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Match Details */}
                    <div className="space-y-3">
                      {/* Match ID */}
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 font-medium">
                          Match Id:
                        </span>
                        <span className="text-white font-mono">
                          {match.matchId}
                        </span>
                      </div>

                      {/* Opponent */}
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 font-medium">
                          Against:
                        </span>
                        <span className="text-white">{match.opponent}</span>
                      </div>

                      {/* Problems Solved */}
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 font-medium">
                          Problem Solve:
                        </span>
                        <span className="text-white">
                          {match.problemsSolved}
                        </span>
                      </div>

                      {/* Result */}
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 font-medium">
                          Result:
                        </span>
                        <span
                          className={`font-semibold flex items-center gap-2 ${
                            match.result === "Win"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {match.result === "Win" ? (
                            <FaTrophy className="text-yellow-500" />
                          ) : (
                            <FaTimes />
                          )}
                          {match.result}
                        </span>
                      </div>
                    </div>

                    {/* Right Column - Date & Actions */}
                    <div className="flex flex-col justify-between items-end">
                      {/* Date */}
                      {match.date && (
                        <div className="text-zinc-400 text-sm text-right">
                          {new Date(match.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      )}

                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewDetails(match)}
                        className="mt-4 px-4 py-2 bg-white hover:bg-zinc-200 text-black text-sm font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Load More Indicator */}
            {matchHistory.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-zinc-500">
                  <span className="text-4xl">...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-3xl w-full relative shadow-2xl max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Modal Header - Fixed */}
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-2xl font-bold text-white pr-8 text-center">
                Match Details
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 flex-1">
              {/* Match Information - 3 on top, 3 on bottom */}
              <div className="space-y-4 mb-6">
                {/* Top Row - 3 items */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Match ID</p>
                    <p className="text-white font-mono text-sm">
                      {selectedMatch.matchId}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Date</p>
                    <p className="text-white text-sm">
                      {new Date(selectedMatch.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Duration</p>
                    <p className="text-white text-sm">
                      {formatDuration(selectedMatch.duration)}
                    </p>
                  </div>
                </div>

                {/* Bottom Row - 3 items */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Opponent</p>
                    <p className="text-white text-sm">
                      {selectedMatch.opponent}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Points</p>
                    <p className="text-white text-sm font-semibold">
                      {selectedMatch.points}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs mb-1">Result</p>
                    <p
                      className={`text-sm font-semibold flex items-center gap-1 ${
                        selectedMatch.result === "Win"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {selectedMatch.result === "Win" ? (
                        <FaTrophy className="text-yellow-500 text-xs" />
                      ) : (
                        <FaTimes className="text-xs" />
                      )}
                      {selectedMatch.result}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="mt-6 pt-6 border-t border-zinc-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Problem Breakdown
                </h3>
                <div className="space-y-3">
                  {selectedMatch.problems &&
                    selectedMatch.problems.map((problem, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          problem.solved
                            ? "bg-green-900/20 border-green-700/50"
                            : "bg-red-900/20 border-red-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              problem.solved ? "bg-green-600" : "bg-red-600"
                            }`}
                          >
                            {problem.solved ? (
                              <FaCheck className="text-white text-sm" />
                            ) : (
                              <FaTimes className="text-white text-sm" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {problem.name}
                            </p>
                            <p
                              className={`text-xs ${
                                problem.difficulty === "Easy"
                                  ? "text-green-400"
                                  : problem.difficulty === "Medium"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {problem.difficulty}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            problem.solved ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {problem.solved ? "Solved" : "Not Solved"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default History;
