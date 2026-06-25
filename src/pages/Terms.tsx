import Layout from "@/components/layout/Layout";
import { ShieldAlert, Scale, FileText, Activity, Zap } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      id: "001",
      title: "Rental Agreement",
      content: "By renting a vehicle from Justice Corporate Logistics Kenya, you agree to be bound by these terms and conditions. The rental agreement constitutes a legally binding contract between you (the \"Renter\") and Justice Corporate Logistics Kenya (the \"Company\")."
    },
    {
      id: "002",
      title: "Driver Requirements",
      list: [
        "Must be at least 23 years of age",
        "Must possess a valid Kenyan driving license or international driving permit",
        "Must have held a valid license for at least 2 years",
        "Must present a valid national ID or passport"
      ]
    },
    {
      id: "003",
      title: "Vehicle Use",
      content: "The rented vehicle must only be used for lawful purposes and within Kenya unless prior written approval is obtained. Prohibited uses include off-road driving (unless specified), racing, towing, or transport of hazardous materials."
    },
    {
      id: "004",
      title: "Insurance Coverage",
      content: "All our vehicles are comprehensively insured. However, the Renter is responsible for any excess amount as specified in the rental agreement. Insurance does not cover damage caused by negligence or breach of rental terms."
    },
    {
      id: "005",
      title: "Fuel Policy",
      content: "Vehicles are provided with a full tank of fuel and must be returned with a full tank. Failure to comply will result in a refueling charge based on current market rates plus a terminal service fee."
    },
    {
      id: "006",
      title: "Payment Terms",
      list: [
        "Full payment is required before vehicle collection",
        "A security deposit is mandatory for all deployments",
        "Accepted: M-Pesa, Bank Transfer, Card Authentication",
        "Late returns incur automatic daily surcharges"
      ]
    },
    {
      id: "007",
      title: "Cancellation Protocol",
      list: [
        "48+ Hours: 100% Refund",
        "24-48 Hours: 50% Refund",
        "Less than 24 Hours: 0% Refund"
      ]
    },
    {
      id: "008",
      title: "NTSA Compliance",
      content: "All units are 100% compliant with National Transport and Safety Authority (NTSA) regulations. Renters must adhere to all Kenyan traffic laws during the operational period."
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
