import { useState, useEffect } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useBattle } from "../context/BattleContext";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import ChatBot from "../components/ChatBot";
import { serverURL } from "../App";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { socket } from "../socket";

function WaitingWindow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { battleData, updateBattleData, resetBattle } = useBattle();
  const { userData } = useUser();
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentName, setOpponentName] = useState("");

  const roomId = (location.state?.roomId || battleData.roomId)
    ?.trim()
    .toUpperCase();

  useEffect(() => {
    if (location.state?.problems && location.state?.roomId) {
      const normalizedRoomId = location.state.roomId.trim().toUpperCase();

      updateBattleData({
        problems: location.state.problems,
        metadata: location.state.metadata,
        roomId: normalizedRoomId,
        isHost: !!location.state.isHost,
        host: location.state.host || null,
      });
    }
  }, []);

  useEffect(() => {
    if (!roomId || !userData?._id) return;

    console.log(`Joining room: "${roomId}"`);

    socket.emit("join-room", {
      roomId,
      userId: userData._id,
      name: userData.name,
    });

    const handleOpponentJoined = ({ userId, name }) => {
      console.log("Opponent joined:", name || userId);
      toast.success(`${name || "Opponent"} joined the room!`);
      setOpponentJoined(true);
      setOpponentName(name || "Opponent");

      updateBattleData({
        opponentJoined: true,
        opponentName: name || "Opponent",
      });
    };

    // --- THIS IS CHANGE #1 ---
    const handleMatchStarted = ({ startTime, metadata }) => {
      console.log("Match started by host", { startTime, metadata });
      toast.success("Battle is started!");

      updateBattleData({
        startTime: startTime, // Use server's authoritative startTime
        metadata: metadata, // Save the metadata
      });

      setTimeout(() => {
        // Use all available sources
        const problems =
          battleData.problems || location.state?.problems || metadata?.problems;
        if (problems && problems.length > 0) {
          const firstProblemId = problems[0]._id || problems[0].id;
          navigate(`/problem/${firstProblemId}`);
        } else {
          toast.error("No problems available");
        }
      }, 500);
    };
    // --- END OF CHANGE #1 ---

    const handleOpponentLeft = ({ userId }) => {
      console.log("Opponent left the room:", userId);
      toast.warning("Opponent has left the room");
      setOpponentJoined(false);
      setOpponentName("");

      updateBattleData({
        opponentJoined: false,
        opponentName: null,
      });
    };

    const handleOpponentDisconnected = ({ userId }) => {
      console.log("Opponent disconnected:", userId);
      toast.error("Opponent disconnected from the room");
      setOpponentJoined(false);
      setOpponentName("");

      updateBattleData({
        opponentJoined: false,
        opponentName: null,
      });
    };

    const handleRoomCancelled = () => {
      toast.error("Host has cancelled the room");
      resetBattle();
      navigate("/battle");
    };

    socket.on("opponent-joined", handleOpponentJoined);
    socket.on("match-started", handleMatchStarted);
    socket.on("opponent-left", handleOpponentLeft);
    socket.on("opponent-disconnected", handleOpponentDisconnected);
    socket.on("room-cancelled", handleRoomCancelled);

    return () => {
      socket.off("opponent-joined", handleOpponentJoined);
      socket.off("match-started", handleMatchStarted);
      socket.off("opponent-left", handleOpponentLeft);
      socket.off("opponent-disconnected", handleOpponentDisconnected);
      socket.off("room-cancelled", handleRoomCancelled);
    };
  }, [
    roomId,
    userData,
    battleData.problems,
    location.state,
    navigate,
    updateBattleData,
    resetBattle,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      toast.success("Room ID copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCancelRoom = async () => {
    try {
      await axios.delete(`${serverURL}/rooms/cancel`, {
        data: { roomId, player1: userData._id },
        withCredentials: true,
      });

      socket.emit("cancel-room", { roomId });

      socket.emit("leave-room", { roomId, userId: userData._id });

      toast.success("Room cancelled successfully");

      resetBattle();

      setShowCancelModal(false);
      navigate("/battle");
    } catch (error) {
      console.error("Cancel Room Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to cancel room"
      );
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", { roomId, userId: userData._id });

    toast.info("You left the room");
    resetBattle();
    navigate("/battle");
  };

  // --- THIS IS CHANGE #2 ---
  const handleStartBattle = () => {
    const problems = battleData.problems || location.state?.problems;
    const metadata = battleData.metadata || location.state?.metadata; // Get metadata

    if (!problems || problems.length === 0) {
      toast.error("No problems available for this battle");
      return;
    }

    if (!metadata) {
      // Add this check
      toast.error("Battle metadata is missing. Cannot start.");
      return;
    }

    if (!opponentJoined) {
      toast.error("Wait for opponent to join first");
      return;
    }

    console.log(`Starting battle in room: "${roomId}"`);

    socket.emit("start-match", {
      roomId,
      metadata: metadata, // Send metadata to the server
    });
  };
  // --- END OF CHANGE #2 ---

  if (!roomId) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full border border-zinc-700 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-4">Error</h3>
          <p className="text-zinc-300 mb-6">
            No room ID found. Please create or join a room.
          </p>
          <button
            onClick={() => navigate("/battle")}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Back to Battle Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-2xl p-8 max-w-2xl w-full border border-zinc-700 shadow-2xl relative">
          <div className="text-center">
            <Tooltip id="copyTooltip" place="bottom" />
            <h3 className="text-3xl font-bold text-white">
              Waiting for Opponent
            </h3>
            <p className="text-zinc-400 mt-2">
              Share the room ID with your opponent to start the battle.
            </p>
          </div>

          <div className="mt-6 p-4 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-between flex-wrap gap-3">
            <span className="text-2xl font-mono text-blue-400">{roomId}</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
                copied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {copied ? (
                <>
                  <FaCheck /> Copied
                </>
              ) : (
                <>
                  <FaCopy /> Copy
                </>
              )}
            </button>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="flex-1 min-w-[180px] bg-zinc-800 border border-blue-500 rounded-xl p-6 flex flex-col items-center shadow-md">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-3">
                <img
                  src="/erenhost.avif"
                  alt="Host"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-lg font-semibold text-blue-300">
                Host {battleData.isHost ? "(You)" : ""}
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                {battleData.isHost
                  ? userData.name
                  : battleData.host?.name || "Host"}
              </div>
            </div>

            <div className="flex-1 min-w-[180px] bg-zinc-800 border border-orange-500 rounded-xl p-6 flex flex-col items-center shadow-md">
              <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold mb-3">
                <img
                  src="/levaichallenger.png"
                  alt="Opponent"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-lg font-semibold text-orange-300">
                Opponent {!battleData.isHost ? "(You)" : ""}
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                {opponentJoined
                  ? `${opponentName} ✅`
                  : !battleData.isHost
                  ? userData.name
                  : "Waiting to join..."}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setShowChat((p) => !p)}
              className="bg-zinc-600 hover:bg-zinc-800 hover:border-2 border-white text-white rounded-full w-11 h-11 flex items-center justify-center text-xl shadow-md transition-all"
              data-tooltip-id="copyTooltip"
              data-tooltip-content={showChat ? "Close Chat" : "Open Chat"}
            >
              💬
            </button>

            {battleData.isHost || location.state?.isHost ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartBattle}
                  disabled={!opponentJoined}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Start Battle
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Cancel Room
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  disabled
                  className="px-5 py-2 bg-zinc-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed"
                >
                  Waiting for Host...
                </button>
                <button
                  onClick={handleLeaveRoom}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Leave Room
                </button>
              </div>
            )}
          </div>

          <p className="text-zinc-500 text-sm mt-4 text-center">
            {battleData.isHost
              ? "Click 'Start Battle' when your opponent joins."
              : "Wait for the host to start the battle."}
          </p>
        </div>

        {showCancelModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
            <div className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-700 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Cancel Room?
              </h3>
              <p className="text-zinc-300 mb-6">
                Are you sure you want to cancel this room? The room will be
                deleted and you'll return to the battle selection page.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium"
                >
                  Keep Waiting
                </button>
                <button
                  onClick={handleCancelRoom}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Cancel Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showChat && (
        <div className="fixed bottom-6 right-6 z-[1000]">
          <ChatBot roomId={roomId} />
        </div>
      )}
    </>
  );
}

export default WaitingWindow;