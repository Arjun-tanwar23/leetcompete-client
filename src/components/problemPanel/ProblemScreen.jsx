import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBattle } from "../../context/BattleContext";
import ProblemNavbar from "./problemNavbar.jsx";
import LeftPanel from "./LeftPanel.jsx";
import RightPanel from "./rightPanel.jsx";

function ProblemScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { battleData } = useBattle();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const isDraggingRef = useRef(false);

  useEffect(() => {
    // Try to get problems from context first, then from location state
    const problemsFromContext = battleData.problems;
    const problemsFromState = location.state?.problems;

    if (problemsFromContext && problemsFromContext.length > 0) {
      console.log("Using problems from context:", problemsFromContext);
      setProblems(problemsFromContext);
      setMetadata(battleData.metadata || location.state?.metadata);
    } else if (problemsFromState) {
      console.log("Using problems from location state:", problemsFromState);
      setProblems(problemsFromState);
      setMetadata(location.state.metadata);
    } else {
      console.log("No problems found, redirecting to battle");
      navigate("/battle");
    }
  }, [location, navigate, battleData]);

  const currentProblem = problems[currentProblemIndex];

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex((prev) => prev + 1);
    }
  };

  const handlePrevProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex((prev) => prev - 1);
    }
  };

  const handleProblemSelect = (index) => {
    setCurrentProblemIndex(index);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const container = document.getElementById("panels-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setLeftPanelWidth(Math.max(30, Math.min(70, newWidth)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <ProblemNavbar
        problems={problems}
        currentIndex={currentProblemIndex}
        onProblemSelect={handleProblemSelect}
        metadata={metadata}
      />
      <div id="panels-container" className="flex h-[calc(100vh-64px)]">
        <div style={{ width: `${leftPanelWidth}%` }}>
          <LeftPanel
            problem={currentProblem}
            currentIndex={currentProblemIndex}
            totalProblems={problems.length}
            onNext={handleNextProblem}
            onPrev={handlePrevProblem}
          />
        </div>
        <div
          onMouseDown={handleMouseDown}
          className="w-1 bg-zinc-800 hover:bg-blue-600 cursor-ew-resize active:bg-blue-500 transition-colors"
        />

        <div style={{ width: `${100 - leftPanelWidth}%` }}>
          <RightPanel problem={currentProblem} />
        </div>
      </div>
    </>
  );
}

export default ProblemScreen;
