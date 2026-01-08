import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
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
      .limit(6);

    if (!error && data) {
      setVehicles(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title mb-2 text-foreground">Featured Vehicles</h2>
            <p className="section-subtitle">
              Explore our premium fleet of well-maintained, fully insured vehicles
            </p>
          </div>
          <Link
            to="/catalogue"
            className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Vehicles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Vehicle Grid */}
        <div className="tile-grid">
          {vehicles.map((vehicle) => (
            <FeaturedVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
