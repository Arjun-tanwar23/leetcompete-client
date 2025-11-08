import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useBattle } from "../../context/BattleContext";
import { toast } from "react-toastify";

function ProblemNavbar({ problems, currentIndex, onProblemSelect, metadata }) {
  console.log("Rendering ProblemNavbar with problems:", problems, "currentIndex:", currentIndex, "metadata:", metadata);
  const navigate = useNavigate();
  const { resetBattle, battleData } = useBattle();
  const [showEndBattleModal, setShowEndBattleModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState("--:--:--");

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!metadata?.duration || !battleData.startTime) {
      setTimeLeft(formatTime((metadata?.duration || 0) * 60 * 1000));
      return;
    }

    const totalDurationMs = metadata.duration * 60 * 1000;
    const endTime = battleData.startTime + totalDurationMs;

    const initialRemaining = endTime - Date.now();
    setTimeLeft(formatTime(initialRemaining));

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const remainingMs = endTime - now;

      if (remainingMs <= 0) {
        clearInterval(timerInterval);
        setTimeLeft(formatTime(0));
        toast.error("Time's up! Battle has ended.");
      } else {
        setTimeLeft(formatTime(remainingMs));
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [metadata?.duration, battleData.startTime]);

  const handleEndBattle = () => {
    resetBattle();
    navigate("/battle");
  };

  const totalProblems = problems?.length || 0;
  const playerProgress = {
    you: {
      name: "You",
      role: "Host",
      problems: Array.from({ length: totalProblems }, (_, i) => ({
        id: i + 1,
        status: "unsolved",
      })),
    },
    opponent: {
      name: "Challenger",
      role: "Opponent",
      problems: Array.from({ length: totalProblems }, (_, i) => ({
        id: i + 1,
        status: "unsolved",
      })),
    },
  };

  const getSolvedCount = (playerProblems) => {
    return playerProblems.filter((p) => p.status === "solved").length;
  };

  return (
    <>
      <nav className="bg-zinc-900 border-b border-zinc-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                resetBattle();
                navigate("/battle");
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <div className="h-6 w-px bg-zinc-700"></div>
            <h1 className="text-white font-bold text-lg">Dev Dual</h1>
          </div>

          <div className="flex items-center gap-2">
            {problems?.map((problem, idx) => (
              <button
                key={problem._id}
                onClick={() => onProblemSelect(idx)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  idx === currentIndex
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {metadata && (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400">Time:</span>
                  <span className="text-white font-semibold font-mono">{timeLeft}</span>
                </div>
                <div className="h-4 w-px bg-zinc-700"></div>
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400">Total:</span>
                  <span className="text-white font-semibold">{metadata.totalProblems}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowProgressModal(true)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm"
            >
              Progress
            </button>
            <button
              onClick={() => setShowEndBattleModal(true)}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm"
            >
              End Battle
            </button>
          </div>
        </div>
      </nav>

      {showProgressModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg p-6 max-w-2xl w-full border border-zinc-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Battle Progress</h3>
              <button
                onClick={() => setShowProgressModal(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* You */}
              <div className="bg-zinc-800/50 rounded-lg p-5 border border-zinc-700">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">{playerProgress.you.name}</h4>
                  <p className="text-sm text-zinc-400">{playerProgress.you.role}</p>
                </div>

                <div className="space-y-3">
                  {playerProgress.you.problems.map((problem) => (
                    <div
                      key={problem.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        problem.status === "solved"
                          ? "bg-green-900/20 border border-green-700/50"
                          : "bg-red-900/20 border border-red-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            problem.status === "solved" ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {problem.status === "solved" ? (
                            <FaCheck className="text-white text-xs" />
                          ) : (
                            <FaTimes className="text-white text-xs" />
                          )}
                        </div>
                        <span className="text-white font-medium">Problem {problem.id}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          problem.status === "solved" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {problem.status === "solved" ? "Solved" : "Unsolved"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-700">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Solved:</span>
                    <span className="text-white font-bold text-lg">
                      {getSolvedCount(playerProgress.you.problems)}/
                      {playerProgress.you.problems.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Opponent */}
              <div className="bg-zinc-800/50 rounded-lg p-5 border border-zinc-700">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">{playerProgress.opponent.name}</h4>
                  <p className="text-sm text-zinc-400">{playerProgress.opponent.role}</p>
                </div>

                <div className="space-y-3">
                  {playerProgress.opponent.problems.map((problem) => (
                    <div
                      key={problem.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        problem.status === "solved"
                          ? "bg-green-900/20 border border-green-700/50"
                          : "bg-red-900/20 border border-red-700/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            problem.status === "solved" ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {problem.status === "solved" ? (
                            <FaCheck className="text-white text-xs" />
                          ) : (
                            <FaTimes className="text-white text-xs" />
                          )}
                        </div>
                        <span className="text-white font-medium">Problem {problem.id}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          problem.status === "solved" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {problem.status === "solved" ? "Solved" : "Unsolved"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-700">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Solved:</span>
                    <span className="text-white font-bold text-lg">
                      {getSolvedCount(playerProgress.opponent.problems)}/
                      {playerProgress.opponent.problems.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowProgressModal(false)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEndBattleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-6 max-w-md w-full border border-zinc-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">End Battle?</h3>
            <p className="text-zinc-300 mb-6">
              Are you sure you want to end this battle? Your progress will be saved and you'll
              return to the battle selection screen.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEndBattleModal(false)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEndBattle}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
              >
                End Battle
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProblemNavbar;
