import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FeaturedVehicleCard from "../vehicles/FeaturedVehicleCard";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  image_url: string | null;
  seats: number | null;
  fuel_type: string | null;
  transmission: string | null;
  status: string | null;
  is_featured: boolean | null;
}

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVehicles();
  }, []);

  const fetchFeaturedVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("is_featured", true)
      .eq("status", "available")
      .limit(4);

    if (!error && data) {
      setVehicles(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-24 bg-black">
        <div className="container mx-auto flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Syncing Asset Database...</p>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) return null;

  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-primary">
            <Activity className="w-4 h-4" />
            Active Inventory
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            Strategic <span className="text-primary">Units.</span>
          </h2>
          <div className="red-divider mx-auto" />
        </div>

        {/* Tactical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <FeaturedVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Global Catalog Trigger */}
        <div className="mt-16 text-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 hover:border-primary/50 transition-all rounded-sm group"
          >
            Access Full Global Catalog
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
