import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function HeroSection() {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "LeetCompete";
  const typingSpeed = 100;

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

  const Cursor = () => (
    <span className="animate-pulse text-4xl md:text-6xl text-white">|</span>
  );

  return (
    <section className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background glowing shapes for visual appeal */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-orange-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 min-h-[100px] md:min-h-[120px]">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {displayedText.slice(0, 4)}
          </span>
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            {displayedText.slice(4)}
          </span>
          <Cursor />
        </h1>

        <p className="text-zinc-300 text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
          Challenge developers worldwide. Compete in real-time coding battles and
          prove your skills.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => navigate("/battle")}
            className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-105 transform w-64"
          >
            ⚡ Create Room
          </button>

          <button
            onClick={() => navigate("/join-room")}
            className="px-10 py-4 bg-zinc-900 text-white rounded-lg font-bold text-lg border-2 border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all shadow-lg hover:shadow-white/10 hover:scale-105 transform w-64"
          >
            ⚔️ Join Room
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-blue-500 transition-all">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Real-Time Battles
            </h3>
            <p className="text-zinc-400 text-sm">
              Compete with developers in live coding challenges.
            </p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-blue-500 transition-all">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Track Progress
            </h3>
            <p className="text-zinc-400 text-sm">
              Monitor your performance and improve your skills.
            </p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-blue-500 transition-all">
            <div className="text-4xl mb-3">💻</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Multiple Languages
            </h3>
            <p className="text-zinc-400 text-sm">
              Code in C++, Java, Python, or JavaScript.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
