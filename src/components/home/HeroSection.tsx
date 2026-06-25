import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

const images = [
  "/home/b1.webp",
  "/home/b2.jpg",
  "/home/b3.jpeg",
  "/home/b4.jpg",
  "/home/b5.jpg",
  "/home/b6.jpg",
  "/home/b7.jpg",
  "/home/b8.jpg",
  "/home/b9.jpg",
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden bg-black">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Professional Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
          </div>
        ))}
      </div>

      <div className="container mx-auto relative z-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Executive Data Badge */}
          <div className="flex justify-center mb-8 animate-fade-up">
            <div className="data-badge border-primary/40 bg-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-red" />
              Justice Corporate Logistics • Operations Active 2026
            </div>
          </div>

          {/* Main Heading with High-Tech Styling */}
          <h1 className="heading-executive mb-8 text-white animate-fade-up tracking-tighter" style={{ animationDelay: '0.1s' }}>
            EXECUTIVE <span className="text-primary">CORPORATE</span> LOGISTICS RENTAL.
          </h1>

          {/* Institutional Copy / Mission Statement */}
          <p className="text-xs md:text-sm font-mono text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed tracking-[0.2em] uppercase animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Authorized provider for high-fidelity vehicle rentals and chauffeur services.
            Facilitating verified asset deployment, corporate fleet management,
            and nationwide logistical fulfillment for NGOs, Government, and Private Entities.
          </p>

          {/* Functional Interface (CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/catalogue"
              className="btn-scan flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5"
            >
              Scan Rental Fleet
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/254702575512"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-terminal flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 hover:bg-green-500/10 hover:border-green-500/30 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-green-500" />
                WhatsApp
              </a>
              <a
                href="tel:0702575512"
                className="btn-outline-terminal flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5"
              >
                <Phone className="w-5 h-5 text-primary" />
                Call Line
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Execute Scroll</span>
        <div className="w-1 h-12 bg-white/10 rounded-full overflow-hidden">
          <div className="w-full h-1/2 bg-primary animate-[move-down_2s_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes move-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
