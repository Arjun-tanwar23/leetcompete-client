import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-zinc-900 border-t-2 border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Logo & Description */}
                    <div>
                        <Link to="/" className="flex items-center mb-4">
                            <span className="text-3xl font-bold">
                                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                    Dev
                                </span>
                                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                                    Dual
                                </span>
                            </span>
                        </Link>
                        <p className="text-zinc-400 text-sm max-w-xs">
                            The ultimate competitive coding platform for real-time developer battles.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Product</h3>
                            <ul className="space-y-3">
                                <li><Link to="/battle" className="text-zinc-400 hover:text-white transition-colors">Create Battle</Link></li>
                                <li><Link to="/problems" className="text-zinc-400 hover:text-white transition-colors">Problems</Link></li>
                                <li><Link to="/leaderboard" className="text-zinc-400 hover:text-white transition-colors">Leaderboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li><Link to="/about" className="text-zinc-400 hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Hackathon Info */}
                    <div>
                         <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">HackCBS Submission</h3>
                         <p className="text-zinc-400 text-sm">
                            Built with ❤️ by YM Solutions
                         </p>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
                    <p className="text-zinc-500 text-sm">
                        &copy; {new Date().getFullYear()} Dev Dual. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;