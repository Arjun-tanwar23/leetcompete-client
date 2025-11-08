import Navbar from "../components/Navbar";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="bg-black min-h-screen relative">
      <div className="hidden md:block fixed left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent z-10"></div>
      <div className="hidden md:block fixed right-8 lg:right-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent z-10"></div>

      <div className="md:px-12 lg:px-20">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
