import Layout from "@/components/layout/Layout";
import { HelpCircle, ChevronDown, ChevronUp, Zap, ShieldCheck, Activity, Info } from "lucide-react";
import { useState } from "react";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-sm overflow-hidden transition-all hover:border-primary/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">{question}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 animate-fade-down">
          <div className="h-[1px] bg-white/5 mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-white/40">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What documents are required for vehicle deployment?",
      answer: "To initiate a mission, the Renter must provide a valid original National ID or Passport, a valid Driving License (held for at least 3 years), and a verified proof of residence or institutional authorization for corporate clients."
    },
    {
      question: "How is the 16% VAT applied to my rental?",
      answer: "All pricing nodes displayed within the Justice Corporate Logistics terminal are 100% VAT inclusive. The 16% Value Added Tax is calculated at the point of registry and included in your final billing cycle to ensure full compliance with Kenyan fiscal laws."
    },
    {
      question: "What is the insurance excess protocol?",
      answer: "Our assets are protected by Comprehensive Insurance. In the event of technical damage or accident, the Renter is liable for an 'Excess' amount which varies by asset class: Saloon units start at KSh 200,000, while premium SUV/4x4 units start at KSh 500,000."
    },
    {
      question: "Are your vehicles NTSA compliant?",
      answer: "Affirmative. Every unit in the JCK fleet undergoes rigorous inspection and is 100% compliant with National Transport and Safety Authority (NTSA) regulations, including up-to-date inspection stickers and speed governor modules where required."
    },
    {
      question: "Can I deploy an asset outside of Nairobi?",
      answer: "Yes. JCK supports nationwide logistical fulfillment. However, for deployments outside the Nairobi Metropolitan area, prior written authorization is required for insurance synchronization and roadside support routing."
    },
    {
      question: "What happens if a vehicle breaks down during a mission?",
      answer: "We maintain a 24/7 Command Support node. In the event of a technical failure, our roadside response matrix is activated immediately. If the unit cannot be repaired within a critical timeframe, a replacement strategic unit will be dispatched to your location."
    },
    {
      question: "Is there a fuel cell management policy?",
      answer: "We operate on a 'Full-to-Full' protocol. Your assigned unit will be delivered with a 100% fuel cell. You are required to return the asset in the same state. Discrepancies are billed at premium market rates."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 z-0">
          <img src="/rental 2.png" alt="FAQ Background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Information Retrieval & Support Matrix
            </div>
            <h1 className="heading-executive">Frequently Asked <span className="text-primary">Questions.</span></h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Standardized responses to common logistical inquiries. Technical insights into our
              operational protocols and service agreements.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          {/* AdSense Policy Alignment Block */}
          <div className="mt-24 p-12 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Trust & Quality Assurance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-primary uppercase">Institutional Reliability</h4>
                <p className="text-[10px] font-bold uppercase text-white/40 leading-relaxed">
                  Justice Corporate Logistics Kenya is founded on the principles of transparency and
                  operational excellence. Our content is reviewed by logistical experts to ensure
                  accuracy in all mission-critical data nodes.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-primary uppercase">Personnel Safety</h4>
                <p className="text-[10px] font-bold uppercase text-white/40 leading-relaxed">
                  Every interaction within our terminal is protected by high-level encryption. We
                  prioritize the security of your personnel and data assets above all else,
                  maintaining a 100% safety record across all deployment cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
