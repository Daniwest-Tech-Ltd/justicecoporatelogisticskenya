import Layout from "@/components/layout/Layout";
import { BookOpen, Car, MapPin, ShieldCheck, Zap, Activity, Info } from "lucide-react";

const LogisticsGuide = () => {
  const guides = [
    {
      title: "Choosing the Right Strategic Unit",
      content: "When initiating a mission in Kenya, vehicle selection is critical. For urban deployments within Nairobi CBD or Westlands, an Executive Sedan provides the necessary agility and fuel efficiency. However, for field operations in the Rift Valley, Maasai Mara, or Northern Kenya, a specialized 4x4 SUV (like the Toyota Land Cruiser V8) is mandatory due to terrain complexity and weather variables.",
      icon: Car
    },
    {
      title: "Understanding Kenyan Road Protocols",
      content: "Kenyan driving protocols follow the left-hand side of the road. Major highways like the Nairobi-Mombasa Express or the Thika Superhighway have strict speed limits (100km/h for private vehicles). It is essential to be aware of the NTSA 'Smart DL' requirements and the presence of digital speed enforcement cameras in high-traffic corridors.",
      icon: ShieldCheck
    },
    {
      title: "Logistical Documentation Readiness",
      content: "Before approaching our terminal for collection, ensure your 'Mission Readiness' pack is complete. This includes your valid original Driving License (at least 3 years old), National ID or Passport, and verified payment credentials. For corporate deployments, a high-fidelity authorization letter from the parent institution is often required for insurance verification.",
      icon: BookOpen
    },
    {
      title: "Fuel and Maintenance Cycles",
      content: "Operational efficiency depends on energy management. JCK units are maintained on a 5,000km service cycle to ensure 100% mission uptime. We recommend refueling at verified premium stations (Shell, TotalEnergies, Rubis) to maintain engine displacement performance. Always check the energy cell levels (Fuel) against the digital registry before departure.",
      icon: Activity
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 z-0">
          <img src="/rental.png" alt="Logistics Background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Educational Registry & Operational Intelligence
            </div>
            <h1 className="heading-executive">Logistics <span className="text-primary">Intelligence.</span></h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Comprehensive guide to automotive deployment in the Kenyan territory. Technical
              insights for successful mission execution and fleet management.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {guides.map((guide, idx) => (
              <div key={idx} className="p-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm group hover:border-primary/40 transition-all">
                <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  <guide.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-6">{guide.title}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-white/40">{guide.content}</p>
              </div>
            ))}
          </div>

          {/* AdSense Value Content Block */}
          <div className="mt-24 p-12 border border-primary/20 bg-primary/5 rounded-sm max-w-6xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Info className="w-32 h-32" /></div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8">Strategic Regional Deployments</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-primary uppercase">Nairobi Metropolitan</h4>
                <p className="text-[10px] font-bold uppercase text-white/40 leading-relaxed">Highly congested traffic nodes. Recommend automatic transmission units with high visibility for safer urban navigation.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-primary uppercase">Coast Province</h4>
                <p className="text-[10px] font-bold uppercase text-white/40 leading-relaxed">High-salinity and humidity environments. All JCK units deployed to Mombasa are treated with anti-corrosive protocols.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-primary uppercase">Upcountry & Rift</h4>
                <p className="text-[10px] font-bold uppercase text-white/40 leading-relaxed">Steep gradients and unpredictable surface states. Requires heavy displacement engines and verified braking systems.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LogisticsGuide;
