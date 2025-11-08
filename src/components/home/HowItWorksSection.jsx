import { FaUserPlus, FaKeyboard, FaTrophy } from 'react-icons/fa';

function HowItWorksSection() {
    const steps = [
        {
            icon: FaUserPlus,
            title: "Create or Join a Room",
            description: "Start a new battle room and invite your friends, or join an existing room using a code.",
            color: "text-blue-400"
        },
        {
            icon: FaKeyboard,
            title: "Solve the Challenge",
            description: "Once the battle starts, race against the clock (and your opponent) to solve the given DSA problems.",
            color: "text-orange-400"
        },
        {
            icon: FaTrophy,
            title: "Claim Your Victory",
            description: "The first developer to pass all test cases wins. Earn points, climb the leaderboard, and gain bragging rights.",
            color: "text-green-400"
        }
    ];

    return (
        <section className="bg-black py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
                        Start your first battle in just 3 simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <div key={index} className="relative flex flex-col items-center text-center p-6">
                                {/* Dotted line connector for desktop */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 left-full transform -translate-y-1/2 w-1/2">
                                        <svg width="100%" height="2">
                                            <line x1="0" y1="1" x2="100%" y2="1" strokeWidth="2" strokeDasharray="5 5" className="stroke-zinc-700" />
                                        </svg>
                                    </div>
                                )}

                                <div className={`relative z-10 w-24 h-24 flex items-center justify-center rounded-full bg-zinc-800 border-4 border-zinc-700 mb-6 ${step.color}`}>
                                    <IconComponent className="w-10 h-10" />
                                    <span className="absolute -top-3 -left-3 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                                        {index + 1}
                                    </span>
                                </div>
                                <h3 className="text-white font-bold text-2xl mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;