import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  Car,
  Loader2,
  Fuel,
  Settings,
  ChevronDown,
  Activity,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import RentalModal from "@/components/rental/RentalModal";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  image_url: string | null;
  seats: number;
  fuel_type: string;
  transmission: string;
  status: string;
  year: number | null;
}

const Catalogue = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showRentalModal, setShowRentalModal] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVehicles(data);
    }
    setLoading(false);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || vehicle.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  const handleRentClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowRentalModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Initializing Fleet Terminal...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black relative">
        {/* Background Visual Asset */}
        <div className="fixed inset-0 z-0">
          <img
            src="/rental.png"
            alt="Terminal Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
          {/* VAT Announcement Button */}
          <div className="flex justify-center mb-10">
            <button
              className="bg-green-600/20 text-green-500 border border-green-500/30 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] animate-up-down shadow-[0_0_20px_rgba(34,197,94,0.2)]"
              title="Value Added Tax Info"
            >
              +16% Added VAT Included
            </button>
          </div>

          {/* Header Interface */}
          <div className="flex flex-col items-center text-center mb-16 space-y-6">
            <div className="data-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              Strategic Rental Deployment Active
            </div>
            <h1 className="heading-executive">
              Rental <span className="text-primary">Fleet.</span>
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/50 leading-relaxed max-w-2xl mx-auto">
              Access Africa's premier automotive inventory. Standardized verification
              protocols applied to all deployment units.
            </p>
            <div className="red-divider mx-auto" />
          </div>

          {/* Audit Bar (Search & Filter) */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="audit-bar p-2 shadow-2xl">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="text"
                  placeholder="ASSET QUERY: MAKE OR MODEL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="audit-input h-14 pl-14 w-full"
                />
              </div>

              <div className="w-full md:w-72 relative border-l border-white/10">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-14 pl-8 pr-12 bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-white appearance-none cursor-pointer focus:outline-none"
                >
                  <option value="" className="bg-black">All Categories</option>
                  <option value="SUV" className="bg-black">SUV Units</option>
                  <option value="Sedan" className="bg-black">Executive Sedans</option>
                  <option value="Van" className="bg-black">Logistics Vans</option>
                  <option value="Luxury" className="bg-black">Luxury Units</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>

              <div className="p-1 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hidden lg:block">
                Total Units: {filteredVehicles.length}
              </div>
            </div>
          </div>

          {/* Strategic Units Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="unit-card group h-full flex flex-col cursor-pointer animate-up-down"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => handleRentClick(vehicle)}
              >
                {/* Visual Area */}
                <div className="relative h-64 overflow-hidden bg-white/[0.02]">
                  {vehicle.image_url ? (
                    <img
                      src={vehicle.image_url}
                      alt={vehicle.name}
                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-xs uppercase tracking-widest">
                      Visual N/A
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest rounded-sm shadow-xl ${
                      vehicle.status === "available" ? "bg-primary" : "bg-red-900/80"
                    }`}>
                      {vehicle.status === "available" ? "Available" : "Booked"}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Data Area */}
                <div className="unit-card-footer flex flex-col flex-1 p-6 bg-black">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors leading-tight">
                      {vehicle.name}
                    </h3>
                  </div>

                  <div className="text-xl font-black text-white mb-6">
                    <span className="text-primary text-xs mr-2 font-bold tracking-tighter uppercase">KSh</span>
                    {formatPrice(vehicle.price_per_day)}
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest ml-2">/ Day</span>
                    <p className="text-[8px] font-mono text-white/20 mt-1 uppercase tracking-widest">VAT (16%) Included</p>
                  </div>

                  {/* Spec Interface */}
                  <div className="unit-spec-grid">
                    <div className="unit-spec-item">
                      <span className="unit-spec-label">Seats</span>
                      <span className="unit-spec-value">{vehicle.seats} Units</span>
                    </div>
                    <div className="unit-spec-item border-x border-white/5">
                      <span className="unit-spec-label">Drive</span>
                      <span className="unit-spec-value">{vehicle.transmission?.substring(0, 3) || "AUT"}</span>
                    </div>
                    <div className="unit-spec-item">
                      <span className="unit-spec-label">Fuel</span>
                      <span className="unit-spec-value">{vehicle.fuel_type?.substring(0, 3) || "PET"}</span>
                    </div>
                  </div>

                  {/* Verification & Action */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary animate-pulse-red" />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Verification Protocol Active</span>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-sm transition-all">
                      Execute Rental
                    </button>
                  </div>

                  <div className="w-12 h-1 bg-primary/20 mt-4 overflow-hidden">
                    <div className="w-full h-full bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-lg">
              <Car className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">No Strategic Units Found In Current Registry</p>
            </div>
          )}
        </div>
      </div>

      {selectedVehicle && (
        <RentalModal
          isOpen={showRentalModal}
          onClose={() => {
            setShowRentalModal(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
        />
      )}
    </Layout>
  );
};

export default Catalogue;
