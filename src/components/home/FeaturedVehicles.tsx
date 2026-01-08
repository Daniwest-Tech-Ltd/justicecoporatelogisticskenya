import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import VehicleCard from "../vehicles/VehicleCard";
import { vehicles } from "@/data/vehicles";

const FeaturedVehicles = () => {
  const featuredVehicles = vehicles.slice(0, 6);

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
          {featuredVehicles.map((vehicle) => (
            <div key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
