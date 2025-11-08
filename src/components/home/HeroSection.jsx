import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function HeroSection() {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "LeetCompete";
  const typingSpeed = 100; // milliseconds per character

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-4 pt-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 min-h-[100px] md:min-h-[120px]">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {displayedText.slice(0, 4)}
          </span>
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {displayedText.slice(4)}
          </span>
          <span className="animate-pulse text-white">|</span>
        </h1>
        <p className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
          Challenge developers worldwide. Compete in real-time coding battles.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => navigate("/battle")}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-2xl hover:scale-105 w-64"
          >
            <span className="relative z-10">Create Room</span>
          </button>

          <button
            onClick={() => navigate("/join-room")}
            className="px-8 py-4 bg-zinc-900 text-white rounded-lg font-bold text-lg border-2 border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all shadow-lg hover:shadow-2xl hover:scale-105 w-64"
          >
            ⚔️ Join Room
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-blue-500 transition-all">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Real-Time Battles
            </h3>
            <p className="text-zinc-400 text-sm">
              Compete with developers in live coding challenges
            </p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-blue-500 transition-all">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Track Progress
            </h3>
            <p className="text-zinc-400 text-sm">
              Monitor your performance and improve your skills
            </p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-blue-500 transition-all">
            <div className="text-4xl mb-3">💻</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Multiple Languages
            </h3>
            <p className="text-zinc-400 text-sm">
              Code in C++, Java, Python, or JavaScript
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
