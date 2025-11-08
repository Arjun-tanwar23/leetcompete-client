import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CTASection from '../components/home/CTASection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function HomePage() {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;