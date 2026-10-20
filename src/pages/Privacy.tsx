import Layout from "@/components/layout/Layout";
import { ShieldCheck, Lock, Fingerprint, Database, Zap, ExternalLink } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      id: "001",
      title: "Data Stewardship & Legal Framework",
      content: "Justice Corporate Logistics Kenya (JCK) operates as a licensed automotive and logistics management provider registered in the Republic of Kenya. We are committed to maintaining strict data privacy, confidentiality, and technical protection standards in accordance with the Kenya Data Protection Act of 2019 and global privacy guidelines."
    },
    {
      id: "002",
      title: "Information Collection & Usage",
      content: "To facilitate vehicle rentals, institutional fleet leasing, and chauffeur dispatches, we collect essential client details, including:",
      list: [
        "Identity Credentials: Full legal name, National ID or Passport number, and Driving License.",
        "Contact Information: Email address, phone number, physical address, and institutional authorization details.",
        "Financial Records: Billing details, M-Pesa transaction IDs, bank transfer logs, and credit card authorizations.",
        "Technical Metadata: IP address, device type, browser settings, and site navigation metrics for security and service optimization."
      ]
    },
    {
      id: "003",
      title: "Google AdSense & Third-Party Advertising Policy",
      content: "Justice Corporate Logistics Kenya uses Google AdSense and third-party advertising partners to deliver ads on our portal. Please review the following mandatory disclosures regarding online advertising:",
      list: [
        "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.",
        "Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.",
        "Users may opt out of personalized advertising by visiting Google Ads Settings at https://adssettings.google.com.",
        "Alternatively, users can opt out of third-party vendor's use of cookies for personalized advertising by visiting www.aboutads.info or Network Advertising Initiative opt-out pages."
      ]
    },
    {
      id: "004",
      title: "Cookies & Analytics Technologies",
      content: "We use cookies, web beacons, and local storage to keep you signed in, remember your fleet search preferences, measure advertising effectiveness, and secure our system against fraudulent activities. You can adjust your browser settings to block cookies, though certain features of our portal may become limited."
    },
    {
      id: "005",
      title: "Data Security & Encryption",
      content: "All personal information transmitted through our portal is protected using modern Industry Standard SSL/TLS and AES-256 encryption. Access to client information is restricted strictly to authorized logistics coordinators, administrative personnel, and legal compliance officers."
    },
    {
      id: "006",
      title: "Third-Party Data Sharing & Statutory Disclosures",
      content: "We do not sell, rent, or trade your personal data to third parties for commercial marketing purposes. Data is shared exclusively with verified operational partners—such as insurance underwriters, vehicle inspection agencies, and payment gateways—or government authorities (NTSA, KRA, Law Enforcement) when legally required."
    },
    {
      id: "007",
      title: "User Rights Under Kenya Data Protection Act 2019",
      content: "As a user of Justice Corporate Logistics Kenya, you possess legal rights regarding your data:",
      list: [
        "Right to Access: Request a copy of all personal records maintained by JCK.",
        "Right to Rectification: Request correction of outdated or incorrect credentials.",
        "Right to Erasure ('Right to be Forgotten'): Request deletion of non-active rental records subject to statutory tax/legal retention periods.",
        "Right to Object: Opt-out of marketing communications and automated data profiling."
      ]
    },
    {
      id: "008",
      title: "Data Retention & Contact Information",
      content: "Rental logs and financial receipts are retained for 7 terrestrial years in accordance with KRA fiscal auditing regulations. If you have questions regarding this Privacy Policy or wish to exercise your data rights, contact our Data Protection Officer at info@justicecorporatelogistics.co.ke or call +254 702 575 512."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Data Protection Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          <div className="flex flex-col items-center text-center mb-20 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Privacy Policy & Google AdSense Standards
            </div>
            <h1 className="heading-executive">
              Privacy <span className="text-primary">Policy.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Official data stewardship framework, cookie disclosures, Google AdSense policy compliance,
              and privacy protocols for Justice Corporate Logistics Kenya.
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
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-white/20 group-hover:text-primary transition-colors uppercase tracking-[0.3em]">
                      Article // {section.id}
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
                        Compliance Verified
                      </span>
                    </div>
                    <Database className="w-3 h-3 text-white/10" />
                  </div>
                </div>
              ))}
            </div>

            {/* AdSense Opt-out Highlight */}
            <div className="mt-8 p-6 border border-primary/30 bg-primary/10 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase text-white tracking-widest">
                  Google AdSense Opt-Out Link
                </h4>
                <p className="text-[10px] text-white/60 uppercase tracking-wider">
                  Manage personalized advertising settings directly through Google.
                </p>
              </div>
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-sm transition-all"
              >
                <span>Google Ad Settings</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Verification Footer */}
            <div className="mt-12 p-8 border border-white/10 bg-black/60 backdrop-blur-xl rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-full">
                  <Fingerprint className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">
                    Data Protection Compliance
                  </h4>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Republic of Kenya Data Protection Act 2019 // AdSense Ready 2026
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-white/20" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
