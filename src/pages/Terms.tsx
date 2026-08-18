import Layout from "@/components/layout/Layout";
import { ShieldAlert, Scale, FileText, Activity, Zap } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      id: "001",
      title: "Binding Rental Agreement & Authority",
      content: "By accessing this terminal and initiating a vehicle rental mission from Justice Corporate Logistics Kenya (JCK), you acknowledge that you have read, understood, and agreed to be legally bound by these Service Protocols. This agreement constitutes a high-fidelity contract between the 'Renter' and JCK. Unauthorized use of our assets without valid authentication is strictly prohibited."
    },
    {
      id: "002",
      title: "Mandatory Personnel Requirements",
      content: "To ensure operational safety and regulatory compliance, all renters and designated drivers must strictly adhere to the following credentials:",
      list: [
        "Age Protocol: Must be at least 23 terrestrial years of age (up to 70 years).",
        "Licensing: Must possess a valid Kenyan driving license with at least 3 years of verified experience.",
        "International Nodes: Foreign nationals must provide an International Driving Permit (IDP) and a valid passport.",
        "Authentication: A clear physical copy of the National ID and DL must be presented during asset collection."
      ]
    },
    {
      id: "003",
      title: "Vehicle Operational Parameters",
      content: "The rented asset must be operated safely and lawfully within the sovereign territory of the Republic of Kenya. JCK assets are strictly prohibited from: 1. Participation in racing or endurance trials. 2. Transporting fare-paying passengers (unless PSV authorized). 3. Off-road navigation without specialized 4x4 authorization. 4. Transporting hazardous or unauthorized materials."
    },
    {
      id: "004",
      title: "Insurance Liability & Excess Protocol",
      content: "All JCK units are governed by Comprehensive Insurance coverage. In the event of an accident, the Renter is liable for the 'Excess' amount determined by the vehicle category (Saloon: 200k, SUV: 500k). Negligence, driving under the influence, or unauthorized driver operation immediately voids the insurance shield, making the Renter 100% liable for all damages."
    },
    {
      id: "005",
      title: "Energy Cell (Fuel) Management",
      content: "JCK operates on a Full-to-Full fuel cycle. Every mission begins with a 100% fuel cell. The Renter is mandated to return the asset in the same state. Discrepancies in fuel levels upon return will be billed at premium market rates plus a logistical service fee of KSh 1,000."
    },
    {
      id: "006",
      title: "Financial Transmission Protocols",
      content: "All financial transactions must be verified before asset release. Our protocols include:",
      list: [
        "Mission Funding: 100% of the rental fee must be settled before deployment.",
        "Security Registry: A refundable deposit (KSh 15,000 - 50,000) is mandatory for liability shielding.",
        "Authentication Nodes: We accept M-Pesa, Bank EFT, and verified Credit Cards.",
        "Temporal Surcharges: Late returns incur an automatic daily cycle fee plus 15%."
      ]
    },
    {
      id: "007",
      title: "Strategic Cancellation Registry",
      content: "Mission aborts are governed by the following temporal penalties:",
      list: [
        "High Alert (48+ Hours): 100% Refund of the rental fee (minus admin node fees).",
        "Medium Alert (24-48 Hours): 50% Refund processing.",
        "Critical Alert (Less than 24 Hours): 0% Refund availability."
      ]
    },
    {
      id: "008",
      title: "NTSA Compliance & Judicial Oversight",
      content: "All JCK assets are 100% compliant with the National Transport and Safety Authority (NTSA) and have active tracking modules. Renters are responsible for all traffic violations and parking fines incurred during the mission cycle. This agreement is subject to the exclusive jurisdiction of the Courts of Kenya."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        {/* Background Visual Asset */}
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Legal Framework Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          {/* Header Interface */}
          <div className="flex flex-col items-center text-center mb-20 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Legal Framework & Service Protocols
            </div>
            <h1 className="heading-executive">
              Service <span className="text-primary">Protocols.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Standardized operational guidelines governing the deployment of Justice Corporate
              Logistics assets. Authentication of terms is mandatory for all missions.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Tactical Grid for Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative group hover:border-primary/40 transition-all flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-primary">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-white/20 group-hover:text-primary transition-colors uppercase tracking-[0.3em]">Article // {section.id}</span>
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
                      <span className="text-[8px] font-mono text-primary/60 uppercase tracking-widest italic">Provision Active</span>
                    </div>
                    <Activity className="w-3 h-3 text-white/10" />
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Footer */}
            <div className="mt-12 p-8 border border-white/10 bg-black/60 backdrop-blur-xl rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-full">
                  <ShieldAlert className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Institutional Oversight</h4>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Last Updated: January 2026 // Operational Sync v4.2</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <span className="block text-[8px] font-mono text-white/20 uppercase">Jurisdiction</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Republic of Kenya</span>
                </div>
                <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                <Scale className="w-6 h-6 text-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
