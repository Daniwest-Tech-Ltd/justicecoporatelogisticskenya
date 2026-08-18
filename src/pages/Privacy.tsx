import Layout from "@/components/layout/Layout";
import { ShieldCheck, Lock, Fingerprint, Eye, Database, Activity, Zap } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      id: "001",
      title: "Introduction to Data Stewardship",
      content: "Justice Corporate Logistics Kenya (JCK) operates a high-fidelity automotive transactional terminal. We are committed to maintaining the highest standards of data integrity and protection. This Privacy Policy outlines our standardized protocols for the collection, processing, and safeguarding of personnel information within our car rental ecosystem, in strict compliance with the Kenya Data Protection Act of 2019."
    },
    {
      id: "002",
      title: "Comprehensive Information Harvesting",
      content: "To facilitate secure logistical deployments, we collect specific data nodes from our personnel and clients. This includes, but is not limited to:",
      list: [
        "Legal Personnel Identity: Full legal names, National ID, or Passport identifiers.",
        "Communication Registry: Verified email nodes and secure phone lines.",
        "Operational Authorization: Validated driving licenses and class certifications.",
        "Financial Telemetry: Payment authentication data and transaction histories.",
        "System Metadata: IP addresses, device identifiers, and session telemetry for network stability."
      ]
    },
    {
      id: "003",
      title: "Strategic Operational Usage",
      content: "Data utilized by JCK is governed by the principle of necessity. We use your information to: 1. Validate identity for vehicle rental missions. 2. Process financial transmissions securely. 3. Ensure regulatory compliance with NTSA and local law enforcement. 4. Optimize the performance of our digital terminal and provide real-time logistical support."
    },
    {
      id: "004",
      title: "Third-Party Data Encryption & Sharing",
      content: "JCK does not sell your personal data matrix to third-party marketing entities. Information is shared strictly with verified institutional partners required for mission completion, including insurance underwriters, verified payment gateways, and judicial authorities if legally mandated."
    },
    {
      id: "005",
      title: "Security Matrix & Technical Safeguards",
      content: "We implement advanced AES-256 encryption protocols for all data at rest and in transit. Our infrastructure is protected by multi-layered firewalls and unauthorized access detection systems. JCK conducts regular security audits to ensure the resilience of our personnel registry against cyber threats."
    },
    {
      id: "006",
      title: "Legal Data Rights Protocol",
      content: "Under the framework of the Kenya Data Protection Act 2019, you maintain the right to: Access your data nodes recorded in our terminal; Correct any informational discrepancies; Request deletion of data once a mission cycle is completed (subject to legal retention requirements)."
    },
    {
      id: "007",
      title: "Temporal Data Retention Registry",
      content: "JCK retains information only for the duration necessary to fulfill our operational and legal mandates. Standard rental records are archived for a period of 7 terrestrial years to comply with institutional financial audit and legal liability standards in Kenya."
    },
    {
      id: "008",
      title: "Cookie Technology & Session Stability",
      content: "Our terminal utilizes persistent and session-based cookies. These digital identifiers are essential for maintaining your authenticated state, managing session stability across the network, and optimizing the tactical loading speeds of our asset visualizers."
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
