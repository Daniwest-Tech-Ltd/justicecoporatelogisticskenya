import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { BookOpen, Calendar, Clock, User, ArrowRight, ShieldCheck, ChevronRight, Search, X } from "lucide-react";

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  summary: string;
  content: string[];
  tags: string[];
}

export const articles: Article[] = [
  {
    id: "001",
    slug: "guide-to-corporate-car-rental-kenya",
    title: "Complete Guide to Corporate Car Rental in Kenya: What Every Business Needs to Know",
    category: "Corporate Mobility",
    readTime: "7 min read",
    date: "February 1, 2026",
    author: "Justice Corporate Editorial Team",
    summary: "Navigating corporate transportation in Kenya requires a clear understanding of fleet options, NTSA compliance, VAT tax structures, and driver vetting protocols. Here is a comprehensive guide for corporate procurement managers.",
    tags: ["Corporate Rental", "Nairobi Business", "Fleet Management", "NTSA Compliance"],
    content: [
      "Operating a commercial enterprise, NGO, or multinational office in Kenya demands dependable transportation infrastructure. Whether moving executive delegations from Jomo Kenyatta International Airport (JKIA) to Westlands, conducting field research in the Rift Valley, or managing long-term regional projects, having access to a reliable automotive fleet is essential to operational success.",

      "1. Assessing Your Institutional Transportation Requirements",
      "Before selecting a car rental provider in Kenya, organizations must conduct an audit of their transport needs. Consider the typical journey profile: Will vehicles remain within urban pavement corridors like Nairobi CBD and Kilimani, or will personnel travel upcountry to dirt roads and construction sites? For city transfers, executive sedans offer fuel efficiency and professional elegance. For upcountry deployments, heavy displacement 4x4 SUVs such as the Toyota Land Cruiser Prado or V8 are mandatory to ensure passenger safety and off-road mobility.",

      "2. Tax Compliance and VAT Calculations in Kenya",
      "Fiscal transparency is a critical factor when managing corporate expense accounts. Under Kenya Revenue Authority (KRA) guidelines, legitimate commercial car rental invoices must reflect Value Added Tax (VAT) at the statutory rate of 16%. Always verify that your rental partner provides compliant tax invoices with registered KRA PINs, enabling your finance team to claim input tax credits where applicable without facing audit discrepancies.",

      "3. NTSA Regulations and Vehicle Safety Standards",
      "The National Transport and Safety Authority (NTSA) strictly regulates commercial and rental motor vehicles in Kenya. Corporate clients should insist on verifying three essential compliance markers before accepting vehicle delivery:",
      "a) Comprehensive Commercial Motor Insurance with explicit extension for passenger liability.",
      "b) Up-to-date NTSA Inspection Certificates verifying mechanical fitness.",
      "c) Calibrated Speed Governors and Real-Time GPS Tracking units for emergency monitoring.",

      "4. Chauffeur Vetting and Defensive Driving Protocol",
      "In many corporate deployments, hiring a professional chauffeur is preferable to self-drive options. Professional drivers eliminate the stress of navigating dense Nairobi traffic, parking management, and route planning. Ensure your logistics provider conducts rigorous background checks, periodic medical evaluations, and defensive driving certifications for all chauffeuring staff.",

      "5. Key Terms in Corporate Rental Contracts",
      "Examine the rental agreement carefully regarding insurance excess limits, fuel policies (Full-to-Full is the industry gold standard), mileage allowances, and breakdown replacement response times. A reputable provider like Justice Corporate Logistics Kenya guarantees replacement vehicle dispatch within critical timeframes should mechanical issues arise."
    ]
  },
  {
    id: "002",
    slug: "choosing-between-suv-sedan-van-kenya",
    title: "Navigating Kenya's Terrain: Choosing Between SUVs, Sedans, and Commercial Vans",
    category: "Fleet Strategy",
    readTime: "6 min read",
    date: "January 28, 2026",
    author: "Justice Corporate Operations Desk",
    summary: "Selecting the wrong vehicle type for Kenyan roads can lead to costly delays or mechanical wear. Learn how to match vehicle displacement, clearance, and passenger capacity to your route.",
    tags: ["Vehicle Selection", "4x4 Travel", "Nairobi Roads", "Safari Transport"],
    content: [
      "Kenya's road network presents a diverse range of driving environments—from smooth multi-lane highways like the Thika Superhighway and Nairobi Expressway to unpaved rural tracks in Kajiado, Narok, and Northern Kenya. Selecting the right vehicle category is vital for comfort, safety, and budget management.",

      "1. Executive Sedans: Efficiency for City Operations",
      "Executive sedans (such as the Mercedes-Benz E-Class, Toyota Mark X, or Crown) excel in urban environments. They offer excellent fuel efficiency, smooth handling through urban congestion, and an elegant profile for diplomatic or corporate meetings in Nairobi, Mombasa, and Kisumu. However, low ground clearance makes sedans unsuitable for deep rural gravel roads or heavy off-road conditions.",

      "2. Full-Size 4x4 SUVs: Unmatched Versatility Across Kenya",
      "For cross-country travel, site inspections, and safari excursions, 4x4 SUVs (such as the Toyota Land Cruiser Prado TX/VX, V8, and Mitsubishi Pajero) remain the undisputed choice. Equipped with high ground clearance, heavy-duty suspension systems, and four-wheel-drive low-range modes, these vehicles comfortably conquer muddy inclines, rocky tracks, and flooded river passes while providing comfortable climate-controlled interiors for passengers.",

      "3. Logistics Vans and Minibuses: Team Mobility and Large Capacity",
      "When transporting large teams, conference delegates, or heavy field equipment, passenger vans (such as the Toyota HiAce Super Custom, Tour Vans, or Coaster Buses) provide optimal seating capacity ranging from 7 to 25 seats. Specialized tour vans feature pop-up roofs for panoramic viewing during site visits and safari legs.",

      "4. Fuel Considerations and Station Selection",
      "When operating high-displacement diesel or gasoline engines across Kenya, always refuel at reputable national fuel brand stations (such as Shell, TotalEnergies, and Rubis) to prevent contaminated fuel from damaging fuel injectors and catalytic converters.",

      "Summary Recommendation:",
      "Match your vehicle selection strictly to your destination. When in doubt, consult Justice Corporate Logistics Kenya coordinators for route-specific vehicle advice."
    ]
  },
  {
    id: "003",
    slug: "ntsa-compliance-safety-regulations-kenya",
    title: "Understanding NTSA Vehicle Compliance and Safety Regulations for Rental Fleets in Kenya",
    category: "Regulatory & Legal",
    readTime: "8 min read",
    date: "January 20, 2026",
    author: "Legal & Regulatory Compliance Dept",
    summary: "A detailed overview of Kenya's road transport laws, NTSA speed governor mandates, instant traffic fines, and statutory insurance requirements for commercial vehicles.",
    tags: ["NTSA", "Traffic Laws", "Kenya Regulations", "Road Safety"],
    content: [
      "Road transport safety in Kenya is overseen by the National Transport and Safety Authority (NTSA) under the Ministry of Roads and Transport. Both individual drivers and corporate entities operating rental motor vehicles must abide by statutory road rules to avoid hefty penalties or impoundment.",

      "1. Mandatory Statutory Documents Required Onboard",
      "Under Kenyan traffic law, every motor vehicle operated on public roads must carry original or verified digital copies of:",
      "• Valid Road License & Inspection Sticker displayed on the windshield.",
      "• Certificate of Commercial/Private Insurance.",
      "• Driver's valid Kenyan Driving License or recognized International Driving Permit (IDP).",

      "2. Speed Limits and Digital Enforcement Cameras",
      "Kenya enforces strict legal speed limits across its highway grid:",
      "• Urban zones and residential areas: 50 km/h.",
      "• Dual carriageways and major highways: 100 km/h for private motorcars.",
      "• Commercial and PSV vehicles: Restricted to 80 km/h via mandatory fitted speed limiters.",
      "NTSA and Kenya Police utilize automated digital speed enforcement cameras on major corridors including the Nairobi Southern Bypass, Thika Road, and the Nairobi-Mombasa Highway. Speeding infractions incur instant digital fines linked directly to the vehicle's logbook.",

      "3. Alcohol Limit and Random Breathalyzer Checks",
      "Kenya enforces zero tolerance for driving under the influence (DUI). Breathalyzer checkpoints ('Alcoblow') are deployed frequently across major cities on weekend evenings and holidays. Conviction results in steep monetary fines, driver license suspension, or mandatory court appearances.",

      "4. Responsibilities of Rental Clients Regarding Traffic Fines",
      "During a rental period, the renter is legally responsible for any traffic violations, parking penalties (e.g., Nairobi City County parking fines), or toll charges (such as the Nairobi Expressway M-Pesa/E-Card charges) incurred. Ensure all city parking fees are paid via designated official codes (*235# or Nairobi Pay portal) to avoid vehicle clamping."
    ]
  },
  {
    id: "004",
    slug: "car-rental-vs-corporate-fleet-leasing-nairobi",
    title: "Cost Comparison: Short-Term Car Rental vs. Long-Term Corporate Fleet Leasing in Nairobi",
    category: "Financial Strategy",
    readTime: "5 min read",
    date: "January 14, 2026",
    author: "Justice Corporate Financial Advisory Desk",
    summary: "Is short-term daily rental or long-term monthly fleet leasing better for your business budget? Analyze the capital expenditure, maintenance, insurance, and tax benefits.",
    tags: ["Fleet Leasing", "Car Rental", "Cost Analysis", "Business Finance"],
    content: [
      "For financial controllers and procurement directors in Kenya, deciding how to structure corporate mobility requires balancing operational flexibility against financial predictability. Here is a direct breakdown comparing short-term car rentals with long-term monthly corporate leasing.",

      "1. Capital Expenditure (CapEx) vs Operational Expenditure (OpEx)",
      "Directly purchasing a company fleet ties up substantial capital in depreciating assets and imposes ongoing administrative burdens for maintenance, insurance renewals, and disposal. In contrast, both short-term rental and long-term operating leases classify vehicle costs strictly as Operational Expenditure (OpEx), preserving balance sheet liquidity and offering 100% tax-deductible operational expense benefits.",

      "2. Short-Term Daily Rentals: Maximum Flexibility",
      "Best for: Project-based visits, seasonal workload surges, visiting international auditors, and executive airport transfers.",
      "Pros: No long-term contractual commitment; pay only for active usage days; instant access to different vehicle categories (sedan today, 4x4 tomorrow).",
      "Cons: Higher effective rate per day compared to long-term monthly contracts.",

      "3. Long-Term Monthly Fleet Leasing: Optimized Rates & Total Maintenance",
      "Best for: Permanent staff transportation, ongoing NGO field offices, and multi-year corporate contracts.",
      "Pros: Significantly lower daily effective rates (30% to 50% discount compared to daily spot rates); all routine servicing, tire replacements, comprehensive insurance, and annual NTSA licenses are managed and funded entirely by Justice Corporate Logistics Kenya; guaranteed replacement vehicle within 2 hours during maintenance.",
      "Cons: Requires a minimum contractual commitment (typically 3 to 24 months).",

      "Conclusion & Recommendation:",
      "If your transportation requirements exceed 15 days per month on a continuous basis, transitioning to a structured long-term corporate lease yields substantial financial savings and streamlined logistics."
    ]
  },
  {
    id: "005",
    slug: "import-documentation-checklist-kenya-logistics",
    title: "A Complete Transport & Customs Documentation Checklist for Kenya Logistics",
    category: "Logistics & Freight",
    readTime: "7 min read",
    date: "January 08, 2026",
    author: "Logistics Operations Team",
    summary: "Navigating Mombasa Port clearing, KRA iTax clearance, customs documentation, and road haulage protocols for goods moving across Kenya and East Africa.",
    tags: ["Customs Clearing", "KRA iTax", "Mombasa Port", "Freight Logistics"],
    content: [
      "The Northern Corridor connecting the Port of Mombasa to Nairobi, Uganda, Rwanda, and South Sudan is East Africa's primary trade artery. Efficient clearance and road transport of commercial cargo require rigorous documentation compliance.",

      "1. Mandatory Customs Clearing Documents in Kenya",
      "To avoid demurrage charges at Mombasa Port or Inland Container Depots (ICD Embakasi), importers must prepare:",
      "• Original Bill of Lading (BL) or Air Waybill (AWB).",
      "• Commercial Invoice & Packing List.",
      "• Import Declaration Form (IDF) processed via KRA iCMS.",
      "• Certificate of Conformity (CoC) issued by pre-inspection agents (PVoC).",
      "• KRA PIN Certificates of both importer and clearing agent.",

      "2. Road Freight Dispatch Protocols",
      "Once customs release is granted, road transport units (commercial trucks or logistics cargo vans) require proper transit documentation, weight bridge compliance certificates, and GPS tracking seals for transit cargo destined for cross-border markets.",

      "3. Last-Mile Courier and Fleet Support",
      "Justice Corporate Logistics Kenya provides dedicated support vehicles, escort units, and light commercial vehicles to ensure fast, secure last-mile delivery from regional hubs to client doorsteps across Kenya."
    ]
  },
  {
    id: "006",
    slug: "planning-upcountry-safari-trips-kenya",
    title: "How to Plan Upcountry and Safari Trips in Kenya: Vehicle Prep, Fuel, and Emergency Protocols",
    category: "Travel & Expedition",
    readTime: "6 min read",
    date: "January 02, 2026",
    author: "Expedition Logistics Specialist",
    summary: "Essential advice for preparing vehicles, planning fuel stops, navigating off-road terrain in national parks, and handling emergency roadside scenarios in Kenya.",
    tags: ["Upcountry Travel", "Safari Kenya", "Road Trip", "Emergency Prep"],
    content: [
      "Embarking on a long-distance road trip from Nairobi to destination hubs like Maasai Mara, Lake Nakuru, Mount Kenya, Samburu, or the Coastal beaches is an unforgettable experience. Proper vehicle preparation ensures a safe and uninterrupted journey.",

      "1. Pre-Departure Vehicle Technical Checklist",
      "Before setting off upcountry, perform a comprehensive pre-departure inspection:",
      "• Check tire pressure, including the spare tire (ensure jack and wheel spanner are present).",
      "• Inspect engine oil levels, coolant, brake fluid, and windshield washer fluid.",
      "• Test all headlamps, indicator lights, and high-beam fog lights.",
      "• Verify that two reflective warning triangles and a functional fire extinguisher are inside the trunk.",

      "2. Fuel Management Strategy",
      "While fuel stations are plentiful along main highways (A104, A109), fuel availability can drop significantly when branching into remote wildlife reserves or Northern counties. Refuel to 100% capacity in major regional towns (e.g. Narok, Nanyuki, Nakuru, Eldoret) before entering wilderness zones.",

      "3. Navigating Wildlife Reserves & Parks",
      "When driving inside Kenya Wildlife Service (KWS) national parks or game reserves:",
      "• Adhere strictly to the 40 km/h speed limit to protect wildlife.",
      "• Do not leave designated tracks; off-roading damages fragile ecosystems and incurs heavy KWS fines.",
      "• Keep windows raised when close to dangerous wildlife.",

      "4. Emergency Roadside Support Matrix",
      "Every vehicle rented from Justice Corporate Logistics Kenya is monitored by real-time tracking systems and backed by 24/7 emergency dispatch lines (+254 702 575 512). In the event of a flat tire or mechanical issue, contact our command center immediately for assistance."
    ]
  }
];

const Blog = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Corporate Mobility", "Fleet Strategy", "Regulatory & Legal", "Financial Strategy", "Logistics & Freight", "Travel & Expedition"];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = activeCategory === "All" || art.category === activeCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        <div className="fixed inset-0 z-0">
          <img src="/rental.png" alt="Logistics Knowledge Base" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          <div className="flex flex-col items-center text-center mb-16 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Logistics & Mobility Knowledge Hub
            </div>
            <h1 className="heading-executive">
              Insights & <span className="text-primary">Guides.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70 leading-relaxed max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
              Authoritative articles, regulatory guidance, fleet strategies, and practical advice for business transport and car rental in Kenya.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto mb-12 space-y-6">
            <div className="audit-bar p-2 shadow-2xl">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="text"
                  placeholder="SEARCH ARTICLES, TOPICS, OR KEYWORDS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="audit-input h-14 pl-14 w-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white border border-primary"
                      : "bg-white/5 text-white/50 border border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm group hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between text-[8px] font-mono text-primary uppercase tracking-[0.3em] mb-4">
                    <span>{article.category}</span>
                    <span className="text-white/30">{article.readTime}</span>
                  </div>

                  <h3 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-primary transition-colors leading-snug mb-4">
                    {article.title}
                  </h3>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-relaxed mb-6 line-clamp-4">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[8px] font-mono text-white/30 uppercase">
                    <Calendar className="w-3 h-3 text-primary/60" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    <span>Read Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-sm">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">No Articles Match Your Filter</p>
            </div>
          )}

          <div className="mt-24 p-12 border border-white/10 bg-black/60 backdrop-blur-md rounded-sm max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Need Customized Fleet Advice?</h3>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Contact our corporate logistics team in Nairobi for tailored fleet proposals, vehicle specifications, or driver deployments.
              </p>
            </div>
            <a
              href="/contact"
              className="bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-[0.3em] px-8 py-4 rounded-sm transition-all whitespace-nowrap"
            >
              Contact Dispatch
            </a>
          </div>
        </div>
      </div>

      {selectedArticle && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-black border border-white/20 rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-12 relative my-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white bg-white/5 border border-white/10 rounded-sm transition-colors"
              title="Close Reader"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="data-badge mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {selectedArticle.category} // {selectedArticle.readTime}
            </div>

            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="flex flex-wrap items-center gap-6 text-[9px] font-mono text-white/40 uppercase pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>{selectedArticle.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{selectedArticle.date}</span>
              </div>
            </div>

            <div className="space-y-6 text-[11px] font-bold uppercase tracking-widest text-white/70 leading-relaxed">
              {selectedArticle.content.map((paragraph, index) => (
                <p key={index} className={paragraph.startsWith("1.") || paragraph.startsWith("2.") || paragraph.startsWith("3.") || paragraph.startsWith("4.") || paragraph.startsWith("5.") ? "text-primary font-black text-xs pt-4 border-t border-white/5" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-2">
              {selectedArticle.tags.map((tag) => (
                <span key={tag} className="text-[8px] font-mono uppercase bg-white/5 border border-white/10 text-white/40 px-3 py-1 rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-10 pt-6 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-sm hover:bg-primary/90 transition-all"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Blog;
