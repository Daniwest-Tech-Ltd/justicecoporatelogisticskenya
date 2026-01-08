import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <h2 className="section-title mb-4">Ready to Hit the Road?</h2>
            <p className="section-subtitle mx-auto mb-8">
              Book your perfect vehicle today and experience premium car rental services in Kenya
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/catalogue"
                className="btn-primary-gradient flex items-center gap-2 text-lg px-8 py-4"
              >
                Browse Vehicles
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:0702575512"
                className="glass-button flex items-center gap-2 text-lg px-8 py-4"
              >
                <Phone className="w-5 h-5" />
                Call Now: 0702575512
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
