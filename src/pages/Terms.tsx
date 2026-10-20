import Layout from "@/components/layout/Layout";
import { ShieldAlert, Scale, FileText, Activity, Zap } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      id: "001",
      title: "Binding Terms & Rental Contract",
      content: "By accessing this website, placing a booking, or utilizing any car rental or logistics service from Justice Corporate Logistics Kenya (JCK), you agree to be bound by these Service Terms. This document forms a legal contract between the client ('Renter' or 'Lessee') and Justice Corporate Logistics Kenya ('Company'). If you disagree with any portion of these terms, you must not proceed with vehicle reservation."
    },
    {
      id: "002",
      title: "Renter Eligibility & Identification Standards",
      content: "To hire or operate a vehicle in Kenya from Justice Corporate Logistics Kenya, drivers must strictly satisfy the following statutory conditions:",
      list: [
        "Age Requirements: Drivers must be between 23 and 70 years of age.",
        "Driving License: Must possess a valid, unexpired Kenyan Driving License held for a minimum of 3 consecutive years.",
        "Foreign Drivers: Non-Kenyan citizens must present a valid passport, work permit/visa, and an International Driving Permit (IDP).",
        "Verification: Original copies of National ID and Driving License must be presented physically prior to vehicle release."
      ]
    },
    {
      id: "003",
      title: "Pricing, VAT & Payment Protocols",
      content: "All rental fees quoted on this portal include Kenya's mandatory 16% Value Added Tax (VAT) in accordance with KRA tax codes.",
      list: [
        "Payment Settlement: 100% of the total rental invoice must be settled prior to vehicle dispatch.",
        "Accepted Payment Nodes: Payments are accepted via M-Pesa Buy Goods/Paybill, Direct Bank Transfer (EFT/RTGS), and verified Credit/Debit Cards.",
        "Refundable Security Deposit: A refundable security deposit (ranging from KSh 15,000 to KSh 50,000 depending on vehicle class) is required to cover potential traffic fines, fuel deficits, or minor damages."
      ]
    },
    {
      id: "004",
      title: "Insurance Coverage & Damage Excess Liability",
      content: "All Justice Corporate Logistics Kenya vehicles carry Comprehensive Motor Commercial Insurance. However, the Renter remains financially liable for an 'Insurance Excess' in the event of accidents, theft, or damage:",
      list: [
        "Saloon & Hatchback Units: Standard Excess of KSh 200,000.",
        "SUV, 4x4 & Executive Units: Standard Excess starting at KSh 500,000.",
        "Exclusions: Driving under the influence of alcohol or drugs, unauthorized drivers, reckless driving, or off-road misuse immediately invalidates insurance coverage, rendering the Renter 100% liable for total vehicle repair or replacement costs."
      ]
    },
    {
      id: "005",
      title: "Fuel Policy & Vehicle Maintenance",
      content: "All rentals operate on a strict 'Full-to-Full' fuel policy. Vehicles are delivered with a full tank of fuel and must be returned with a full tank of fuel. Any fuel shortfall upon return will be charged to the client at market fuel rates plus a KSh 1,000 logistical service surcharge. Regular maintenance, engine oil, and routine wear-and-tear are managed directly by JCK."
    },
    {
      id: "006",
      title: "Geographical Restrictions & Upcountry Travel",
      content: "Vehicles are approved for operation within the sovereign borders of the Republic of Kenya. Travel outside urban areas (Nairobi Metropolitan) or to off-road destinations (e.g. Maasai Mara, Northern Kenya, Turkana) requires explicit written authorization from JCK for tracking and breakdown support routing. Cross-border travel requires prior clearance and specialized insurance documentation."
    },
    {
      id: "007",
      title: "Cancellation & Modification Policy",
      content: "Cancellations made 48 hours or more prior to the scheduled pickup date are eligible for a full refund minus administrative processing fees. Cancellations made between 24 and 48 hours prior receive a 50% refund. Cancellations made less than 24 hours prior or no-shows are non-refundable."
    },
    {
      id: "008",
      title: "NTSA Regulatory Compliance & Jurisdiction",
      content: "All vehicles are 100% compliant with the National Transport and Safety Authority (NTSA) of Kenya, equipped with active speed governors, valid inspection certificates, and real-time tracking units. The Renter is solely responsible for paying any traffic fines, instant parking violations, or municipal penalties incurred during the rental period. These terms are governed by the laws of Kenya."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Legal Terms Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          <div className="flex flex-col items-center text-center mb-20 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Service Terms & NTSA Compliance Standard
            </div>
            <h1 className="heading-executive">
              Service <span className="text-primary">Terms.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Standardized operational protocols, liability agreements, fuel policies,
              and rental terms governing Justice Corporate Logistics Kenya.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto">
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
                    <span className="text-[9px] font-mono text-white/20 group-hover:text-primary transition-colors uppercase tracking-[0.3em]">
                      Provision // {section.id}
                    </span>
                  </div>

                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4">
                    {section.title}
                  </h3>

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
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span className="text-[8px] font-mono text-primary/60 uppercase tracking-widest italic">
                        Legal Active
                      </span>
                    </div>
                    <Activity className="w-3 h-3 text-white/10" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 border border-white/10 bg-black/60 backdrop-blur-xl rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-full">
                  <ShieldAlert className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">
                    Jurisdiction & Legal Oversight
                  </h4>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Republic of Kenya Courts // NTSA Compliant 2026
                  </p>
                </div>
              </div>
              <Scale className="w-6 h-6 text-white/20" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
