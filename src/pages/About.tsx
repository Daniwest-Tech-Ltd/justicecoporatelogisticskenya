import Layout from "@/components/layout/Layout";
import { Target, Eye, Users, Award, Shield, Clock, Activity, Fingerprint, Zap, ExternalLink, MapPin, CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 z-0">
          <img
            src="/rental 2.png"
            alt="Corporate Operations Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Company Overview & Institutional Profile
            </div>
            <h1 className="heading-executive">
              About <span className="text-primary">Justice Corporate Logistics.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Kenya's leading provider of executive car rentals, corporate fleet leasing, and professional chauffeur services. Serving NGOs, Government agencies, corporate entities, and discerning private clients across East Africa.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
            <div className="lg:col-span-4 group relative">
              <div className="relative overflow-hidden rounded-sm border border-white/10 bg-black/40 backdrop-blur-md p-2 h-full flex flex-col">
                <div className="absolute top-6 left-6 z-20">
                  <div className="data-badge bg-primary text-white border-none py-1 px-3 shadow-lg">FOUNDER & CEO</div>
                </div>

                <div className="relative overflow-hidden rounded-sm bg-white/5">
                  <img
                    src="/ceo.png"
                    alt="CEO Justice Vincent"
                    className="w-full h-auto grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>

                <div className="mt-6 p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-1">CEO Justice Vincent</h3>
                    <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-4">Chief Executive Officer</p>
                    <p className="text-[10px] text-white/60 leading-relaxed uppercase mb-6">
                      Leading automotive mobility innovation and institutional fleet scaling across Kenya and the East African region.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Our Sister Business Units:</p>
                    <a
                      href="https://www.justiceultimateautomobiles.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-2.5 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group/btn rounded-sm"
                    >
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Justice Ultimate Automobiles</span>
                      <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </a>
                    <a
                      href="https://www.justicecorporatelogistics.co.ke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-2.5 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group/btn rounded-sm"
                    >
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Justice Corporate Logistics Kenya</span>
                      <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="p-10 border border-white/10 bg-black/20 backdrop-blur-[2px] rounded-sm relative group overflow-hidden h-full flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-1 h-12 bg-primary group-hover:h-full transition-all duration-700" />
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-primary">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-white">Company History & Operational Mission</h2>
                  </div>

                  <div className="space-y-6 text-[11px] font-bold uppercase tracking-widest leading-relaxed text-white/60 mb-8">
                    <p>
                      Justice Corporate Logistics Kenya was founded with a clear objective: to deliver dependable, high-quality, and transparent car rental and corporate transportation solutions in Kenya. Based on Muthithi Road, Westlands, Nairobi, our operations have expanded to serve corporate institutions, international delegations, non-governmental organizations, and local business travelers.
                    </p>

                    <p>
                      We maintain a meticulously serviced fleet that spans executive sedans, rugged 4x4 SUVs, luxury VIP vehicles, and spacious commercial vans. Every vehicle in our fleet undergoes a thorough 50-point technical inspection prior to dispatch and is fully compliant with National Transport and Safety Authority (NTSA) regulations and KRA tax standards.
                    </p>

                    <p>
                      Our competitive edge lies in our commitment to reliability, transparent pricing with mandatory 16% VAT included, round-the-clock roadside assistance, and professional, vetted chauffeurs trained in executive protocol and defensive driving.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-white/5">
                  <div className="p-6 border border-white/5 bg-black/40 backdrop-blur-md rounded-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <Target className="w-5 h-5 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Our Core Mission</h3>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                      To provide safe, reliable, and premium automotive rental services in Kenya, exceeding client expectations through technical excellence and superior customer care.
                    </p>
                  </div>

                  <div className="p-6 border border-white/5 bg-black/40 backdrop-blur-md rounded-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <Eye className="w-5 h-5 text-primary" />
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Our Strategic Vision</h3>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                      To be the most trusted corporate mobility and logistics partner in East Africa, recognized for safety, fleet quality, and digital efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-4">
              <div className="flex items-center gap-3 text-primary mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Corporate Fleet Leasing</h3>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed uppercase">
                Flexible long-term vehicle leasing solutions designed for companies, embassies, and NGOs seeking managed fleets without capital expenditure liabilities.
              </p>
            </div>

            <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-4">
              <div className="flex items-center gap-3 text-primary mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Chauffeur & VIP Transfers</h3>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed uppercase">
                Professional, bilingual, defensive-driver trained chauffeurs for airport transfers, diplomatic delegations, executive meetings, and special events.
              </p>
            </div>

            <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-4">
              <div className="flex items-center gap-3 text-primary mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Upcountry & Safari Operations</h3>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed uppercase">
                Heavy-displacement 4x4 Land Cruisers and Prados prepared for rugged terrain across Kenya's national parks, Rift Valley, and remote development project sites.
              </p>
            </div>
          </div>

          <div className="mb-24">
            <div className="flex items-center gap-4 mb-12">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">Our Service Commitments</h2>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, title: "NTSA & Safety Certified", desc: "Speed governors, valid inspection stickers, and full commercial insurance on all vehicles." },
                { icon: Users, title: "Vetted Professional Drivers", desc: "Rigorous background checks, medical clearances, and defensive driving certifications." },
                { icon: Award, title: "100% Price Transparency", desc: "No hidden charges. Mandatory 16% VAT fully computed and disclosed upfront." },
                { icon: Clock, title: "24/7 Roadside Assistance", desc: "Continuous monitoring and immediate replacement vehicle dispatch in case of unforeseen mechanical issues." },
              ].map((value, index) => (
                <div key={index} className="p-8 border border-white/5 bg-black/10 backdrop-blur-[2px] group hover:border-primary/40 transition-all flex flex-col h-full rounded-sm">
                  <div className="text-primary mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-4">{value.title}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 leading-relaxed flex-1">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-12 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
              {[
                { value: "50+", label: "SERVICED VEHICLES" },
                { value: "1000+", label: "COMPLETED MISSIONS" },
                { value: "5+", label: "YEARS OPERATIONAL" },
                { value: "24/7", label: "CUSTOMER SUPPORT" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <p className="text-4xl md:text-5xl font-black text-primary tracking-tighter">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
