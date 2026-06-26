import { Link } from "react-router-dom";
import { Phone, ArrowRight, Zap, ShieldCheck } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-black overflow-hidden relative border-t border-white/5">
      {/* Background Asset with Technical Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/rent.jpg"
          alt="Deployment Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.15)_0%,transparent_70%)] z-20" />
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <div className="max-w-6xl mx-auto p-12 md:p-24 border border-white/20 bg-black/10 backdrop-blur-[2px] rounded-lg shadow-2xl relative overflow-hidden">
          
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Status Overlay */}
          <div className="absolute top-8 right-8 hidden md:flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded-sm">
            <Zap className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Execution Ready</span>
          </div>

          <div className="text-center max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-8">
              <ShieldCheck className="w-5 h-5" />
              Final Deployment Protocol
            </div>

            <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter text-white uppercase leading-none">
              Initiate Your <br />
              <span className="text-primary">Logistical Success.</span>
            </h2>

            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 mb-16 leading-relaxed">
              Authenticate your fleet requirements today. Join our network of
              high-fidelity institutional partners across the Kenyan territory.
              <span className="block mt-4 text-white font-black text-[10px] tracking-[0.4em] bg-primary/20 py-2 inline-block px-6 border border-primary/40 rounded-sm">VAT OF 16% INCLUDED ON ALL DEPLOYMENTS</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                to="/catalogue"
                className="btn-scan flex items-center justify-center gap-4 w-full sm:w-auto px-16 py-6 group"
              >
                Access Inventory
                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
              </Link>
              <a
                href="tel:0702575512"
                className="btn-outline-terminal flex items-center justify-center gap-4 w-full sm:w-auto px-16 py-6 hover:border-primary/50"
              >
                <Phone className="w-6 h-6 text-primary" />
                Dispatch Desk
              </a>
            </div>

            {/* Performance Metrics */}
            <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {[
                { label: "Uptime", value: "99.9%" },
                { label: "Dispatch", value: "<15m" },
                { label: "Assurance", value: "100%" },
                { label: "VAT", value: "16%" },
                { label: "Status", value: "Verified" }
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">{metric.label}</span>
                  <span className="text-xs font-black tracking-widest text-white">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
