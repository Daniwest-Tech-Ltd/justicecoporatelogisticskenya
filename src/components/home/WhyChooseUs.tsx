import { Shield, Clock, Users, Headphones, CheckCircle, Activity, Globe } from "lucide-react";

const protocols = [
  {
    icon: Shield,
    title: "NTSA Compliance Protocol",
    description: "Full regulatory compliance and standard verification for all deployment units.",
    id: "005"
  },
  {
    icon: CheckCircle,
    title: "Asset Protection",
    description: "Comprehensive insurance coverage and liability shielding for every mission.",
    id: "007"
  },
  {
    icon: Users,
    title: "Institutional Chauffeurs",
    description: "Vetted professional personnel specialized in high-fidelity logistical execution.",
    id: "007"
  },
  {
    icon: Clock,
    title: "24/7 Command Support",
    description: "Round-the-clock operational assistance and real-time roadside response.",
    id: "008"
  },
  {
    icon: Globe,
    title: "Nationwide Fulfillment",
    description: "Strategic logistics network covering all major hubs and remote territories.",
    id: "000"
  },
  {
    icon: Headphones,
    title: "Transactional Ease",
    description: "Encrypted booking interface with immediate institutional approval metrics.",
    id: "009"
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden border-t border-white/5">
      {/* Background Asset with Technical Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/rental.png"
          alt="Protocol Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header Interface */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6 animate-pulse">
            <Activity className="w-4 h-4" />
            Operational Protocols
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter text-white uppercase leading-none">
            The Justice <span className="text-primary">Standard.</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white leading-relaxed max-w-2xl mx-auto border-l-2 border-primary/60 pl-6 bg-black/40 backdrop-blur-sm py-2">
            We provide the high-fidelity logistical infrastructure required for
            successful corporate and institutional operations across Kenya.
          </p>
        </div>

        {/* Technical Protocols Grid - Transparent with subtle blur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.map((protocol) => (
            <div
              key={protocol.title}
              className="p-8 border border-white/20 bg-black/10 backdrop-blur-[2px] hover:bg-black/40 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden flex flex-col h-full rounded-sm"
            >
              {/* Identification Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <protocol.icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono text-white/20 group-hover:text-primary transition-colors">ID // PROTOCOL_{protocol.id}</span>
              </div>

              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-white group-hover:text-primary transition-colors">
                {protocol.title}
              </h3>

              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 leading-relaxed mb-8 flex-1">
                {protocol.description}
              </p>

              {/* Status Bar */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-[8px] font-mono text-primary uppercase tracking-widest">Protocol Active</span>
                </div>
                <div className="w-8 h-[1px] bg-white/10 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
