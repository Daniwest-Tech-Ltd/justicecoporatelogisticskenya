import Layout from "@/components/layout/Layout";
import { Target, Eye, Users, Award, Shield, Clock, Activity, Fingerprint, Zap, ExternalLink } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        {/* Background Visual Asset */}
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Corporate Operations Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          {/* Header Interface */}
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Corporate Identity & Operational Mandate
            </div>
            <h1 className="heading-executive">
              About <span className="text-primary">Justice.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Africa's premier automotive transactional terminal. specializing in
              high-fidelity logistical infrastructure for corporate, government,
              and private institutional deployments.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          {/* Institutional Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
            {/* CEO Executive Tile */}
            <div className="lg:col-span-4 group relative">
              <div className="relative overflow-hidden rounded-sm border border-white/10 bg-black/40 backdrop-blur-md p-2 h-full">
                {/* Identification Badges */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="data-badge bg-primary text-white border-none py-1 px-3 shadow-lg">FOUNDER</div>
                </div>

                {/* CEO Image Terminal */}
                <div className="relative overflow-hidden rounded-sm bg-white/5">
                  <img
                    src="/ceo.png"
                    alt="CEO Justice Vincent"
                    className="w-full h-auto grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 block"
                  />

                  {/* Dynamic Hover Overlay */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                    <div className="w-12 h-1 bg-primary mb-4" />
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">CEO JUSTICE VINCENT</h3>
                    <p className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">Chief Executive Officer</p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>

                {/* CEO Institutional Mandate */}
                <div className="mt-6 p-4">
                  <span className="block text-[8px] font-mono text-primary mb-4 tracking-[0.3em]">EXECUTIVE PROFILE // 001</span>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Visionary Founder Of:</p>
                    <a
                      href="https://www.justiceultimateautomobiles.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group/btn rounded-sm"
                    >
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Justice Ultimate Automobiles</span>
                      <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://www.justiceautomotive.co.ke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group/btn rounded-sm"
                    >
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Justice Automotive Kenya</span>
                      <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://www.justicecorporatelogistics.co.ke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group/btn rounded-sm"
                    >
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Justice Corporate Logistics Kenya</span>
                      <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  <div className="mt-8 flex items-center gap-2">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Story & Mission Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-10 border border-white/10 bg-black/20 backdrop-blur-[2px] rounded-sm relative group overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-1 h-12 bg-primary group-hover:h-full transition-all duration-700" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-primary">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-widest text-white">The Justice Origin</h2>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-white/60 mb-6">
                  Justice Corporate Logistics Kenya was established as a high-fidelity hub to bridge the gap
                  between luxury mobility and mission-critical logistical execution.
                  What originated as a specialized fleet deployment has scaled into a
                  nationwide operational terminal.
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-white/60 mb-8">
                  Today, we serve as the primary mobility partner for international NGOs,
                  State Organs, and Corporate entities requiring 100% reliability and
                  secure logistical fulfillment in the Kenyan territory.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-white/5">
                  {[
                    {
                      icon: Target,
                      title: "Institutional Mission",
                      description: "To provide high-fidelity vehicle deployment protocols that exceed global standards through a verified fleet.",
                      id: "001"
                    },
                    {
                      icon: Eye,
                      title: "Strategic Vision",
                      description: "To operate the leading automotive transactional terminal in East Africa, defined by logistical encryption.",
                      id: "002"
                    }
                  ].map((item) => (
                    <div key={item.id} className="p-6 border border-white/5 bg-black/40 backdrop-blur-md rounded-sm group/item hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <item.icon className="w-5 h-5 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">{item.title}</h3>
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Operational Values Protocol */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-12">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">Operational Values Protocol</h2>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, title: "Safety Protocol", desc: "Rigorous 50-point technical verification before every deployment." },
                { icon: Users, title: "Institutional Sync", desc: "Dedicated concierge for Government and NGO requirements." },
                { icon: Award, title: "Service Authority", desc: "Unmatched excellence in logistical fulfillment and fleet scaling." },
                { icon: Clock, title: "24/7 Command", desc: "Continuous operational support and roadside response matrix." },
              ].map((value, index) => (
                <div key={index} className="p-8 border border-white/5 bg-black/10 backdrop-blur-[2px] group hover:border-primary/40 transition-all flex flex-col h-full rounded-sm">
                  <div className="text-primary mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-4">{value.title}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-relaxed flex-1">{value.desc}</p>
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-mono text-primary/40 group-hover:text-primary transition-colors">STATUS: ACTIVE</span>
                    <Zap className="w-3 h-3 text-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Statistics Interface */}
          <div className="p-12 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[8px] font-mono text-white/10 uppercase tracking-[0.5em]">Real-time Metrics // 2026</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
              {[
                { value: "50+", label: "ACTIVE UNITS" },
                { value: "1000+", label: "SUCCESSFUL MISSIONS" },
                { value: "5+", label: "TERMINAL YEARS" },
                { value: "24/7", label: "COMMAND UPTIME" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <p className="text-4xl md:text-5xl font-black text-primary tracking-tighter">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
            {/* Red Accent Base */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
              <div className="w-1/3 h-full bg-primary animate-[move-horizontal_4s_infinite]" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes move-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </Layout>
  );
};

export default About;
