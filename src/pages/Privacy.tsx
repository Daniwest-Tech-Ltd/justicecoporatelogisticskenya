import Layout from "@/components/layout/Layout";
import { ShieldCheck, Lock, Fingerprint, Eye, Database, Activity, Zap } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      id: "001",
      title: "Data Stewardship",
      content: "Justice Corporate Logistics Kenya is committed to protecting your privacy. We implement high-fidelity protocols to collect, use, and safeguard your information within our car rental ecosystem."
    },
    {
      id: "002",
      title: "Information Harvesting",
      list: [
        "Legal Personnel Identity (Name, ID/Passport)",
        "Communication Nodes (Email, Phone)",
        "Operational Authorization (Driving License)",
        "Financial Authentication (Payment Details)",
        "System Telemetry (IP, Device Data)"
      ]
    },
    {
      id: "003",
      title: "Operational Usage",
      content: "Data is utilized for vehicle rental management, identity verification, payment processing, and regulatory compliance within the Kenyan territory."
    },
    {
      id: "004",
      title: "Encrypted Sharing",
      content: "We do not sell personal data. Information is shared only with verified partners: insurance providers, payment processors, and regulatory bodies like NTSA."
    },
    {
      id: "005",
      title: "Security Matrix",
      content: "We implement advanced technical and organizational measures to protect your data matrix against unauthorized access. Our terminal uses encrypted transmission protocols."
    },
    {
      id: "006",
      title: "Data Rights Protocol",
      content: "Under the Kenya Data Protection Act 2019, you maintain the right to access, correct, or request deletion of your personal data nodes from our terminal."
    },
    {
      id: "007",
      title: "Temporal Retention",
      content: "Information is retained only for the duration required for operational fulfillment. Legal records are archived for a minimum of 7 terrestrial years."
    },
    {
      id: "008",
      title: "System Cookies",
      content: "Our terminal utilizes essential cookies to maintain session stability and optimize your browsing experience within the secure network."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        {/* Background Visual Asset */}
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Data Security Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          {/* Header Interface */}
          <div className="flex flex-col items-center text-center mb-20 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Data Encryption & Privacy Protocols
            </div>
            <h1 className="heading-executive">
              Privacy <span className="text-primary">Policy.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Standardized data protection framework governing the acquisition and management of
              personnel information within the Justice Corporate network.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Tactical Grid for Privacy Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative group hover:border-primary/40 transition-all flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-primary">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-white/20 group-hover:text-primary transition-colors uppercase tracking-[0.3em]">Sector // {section.id}</span>
                  </div>

                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4">{section.title}</h3>

                  {section.content && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-relaxed mb-6 flex-1">
                      {section.content}
                    </p>
                  )}

                  {section.list && (
                    <ul className="space-y-2 mb-6 flex-1">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Zap className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span className="text-[8px] font-mono text-primary/60 uppercase tracking-widest italic">Encryption Active</span>
                    </div>
                    <Database className="w-3 h-3 text-white/10" />
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Footer */}
            <div className="mt-12 p-8 border border-white/10 bg-black/60 backdrop-blur-xl rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-full">
                  <Fingerprint className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Encryption Oversight</h4>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Standard: AES-256 // Compliance Sync: 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <span className="block text-[8px] font-mono text-white/20 uppercase">Network Status</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Secure Transactional Line</span>
                </div>
                <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                <ShieldCheck className="w-6 h-6 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
