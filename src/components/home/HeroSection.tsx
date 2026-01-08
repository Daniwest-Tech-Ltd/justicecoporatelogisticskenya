import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">Premium Car Rentals in Kenya</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Reliable Car Rentals
            <span className="block text-primary mt-2">Kenya — 2026</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Self Drive • Chauffeur Driven • Corporate • Events • Long-Term Rentals
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/catalogue"
              className="btn-primary-gradient flex items-center gap-2 text-lg px-8 py-4"
            >
              Browse Rental Cars
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/254702575512"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button flex items-center gap-2 text-lg px-8 py-4 hover:bg-green-500/20"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a
              href="tel:0702575512"
              className="glass-button flex items-center gap-2 text-lg px-8 py-4"
            >
              <Phone className="w-5 h-5" />
              Call 0702575512
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              "NTSA Compliant",
              "Fully Insured",
              "24/7 Support",
              "Corporate Ready",
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-sm font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
