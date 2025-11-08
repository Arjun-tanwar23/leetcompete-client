import { useNavigate } from 'react-router-dom';

function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="bg-black py-24 px-4">
            <div className="max-w-4xl mx-auto text-center relative">
                {/* Gradient background blur */}
                <div className="absolute inset-x-0 top-0 w-3/4 h-48 mx-auto bg-gradient-to-r from-blue-600 to-orange-600 rounded-full mix-blend-lighten filter blur-3xl opacity-30"></div>

                <div className="relative z-10">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Ready to Prove Your Skills?
                    </h2>
                    <p className="text-zinc-300 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
                        Join thousands of developers in the ultimate coding arena. Create a room, challenge a friend, and start your dual now.
                    </p>
                    <button
                        onClick={() => navigate('/battle')}
                        className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-500/40 hover:scale-105 transform"
                    >
                        ⚡ Start Battling Now
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CTASection;