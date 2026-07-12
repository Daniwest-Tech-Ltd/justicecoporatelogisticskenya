import { Link } from "react-router-dom";
import { User, ArrowRight, Zap } from "lucide-react";

const DriverCTA = () => {
  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto p-12 md:p-16 border border-primary/20 bg-primary/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-primary">
              <User className="w-4 h-4" />
              Join the Elite Fleet
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Are you a <span className="text-primary">Driver?</span>
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 leading-relaxed max-w-xl">
              We've got you covered. Apply to join our institutional network and wait to be informed of waiting work and high-priority missions.
            </p>
          </div>

          <Link
            to="/driver-application"
            className="btn-scan px-12 py-6 flex items-center gap-4 group shrink-0"
          >
            Apply Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Decorative pulse background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
    </section>
  );
};

export default DriverCTA;
