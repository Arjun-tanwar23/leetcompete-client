import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function HeroSection() {
    const navigate = useNavigate();
    const [displayedText, setDisplayedText] = useState("");
    const fullText = "Dev Dual";
    const typingSpeed = 100;

    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                // Optionally reset the animation
                currentIndex = 0; 
                // Or just clear interval
                // clearInterval(typingInterval);
            }
        }, typingSpeed);

        // Add a slight delay before restarting
        const loopInterval = setInterval(() => {
            currentIndex = 0;
            setDisplayedText("");
        }, 5000); // Loops every 5 seconds

        return () => {
            clearInterval(typingInterval);
            clearInterval(loopInterval);
        };
    }, []);

    // Blinking cursor effect
    const Cursor = () => (
        <span className="animate-pulse text-4xl md:text-6xl text-orange-500">|</span>
    );

    return (
        <section className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background glowing shapes for visual interest */}
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
                    Challenge developers worldwide. Compete in real-time coding battles and prove your skills.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button
                        onClick={() => navigate('/battle')}
                        className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-105 transform w-64"
                    >
                        ⚡ Create Room
                    </button>

                    <button
                        onClick={() => navigate('/join-room')}
                        className="px-10 py-4 bg-zinc-900 text-white rounded-lg font-bold text-lg border-2 border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-all shadow-lg hover:shadow-white/10 hover:scale-105 transform w-64"
                    >
                        ⚔️ Join Room
                    </button>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;