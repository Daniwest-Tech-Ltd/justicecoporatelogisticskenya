import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import RentalModal from "../rental/RentalModal";

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
}

interface FeaturedVehicleCardProps {
  vehicle: Vehicle;
}

const FeaturedVehicleCard = ({ vehicle }: FeaturedVehicleCardProps) => {
  const [showRentalModal, setShowRentalModal] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  return (
    <>
      <div className="unit-card group h-full flex flex-col cursor-pointer" onClick={() => setShowRentalModal(true)}>
        {/* Visual Asset Area */}
        <div className="relative h-64 overflow-hidden bg-white/[0.02]">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 uppercase font-black text-xs tracking-widest">
              Visual N/A
            </div>
          )}

          {/* Status Badge Overlays */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-sm shadow-xl">
              Available
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

          {/* Expand Trigger Icon */}
          <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Tactical Data Area */}
        <div className="unit-card-footer flex flex-col flex-1 p-6 bg-black">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors leading-tight">
              {vehicle.name}
            </h3>
          </div>

          <div className="text-xl font-black text-white mb-6">
            <span className="text-primary text-xs mr-2 font-bold tracking-tighter uppercase">KSh</span>
            {formatPrice(vehicle.price_per_day)}
          </div>

          {/* Unit Specs Interface */}
          <div className="unit-spec-grid">
            <div className="unit-spec-item">
              <span className="unit-spec-label">Model</span>
              <span className="unit-spec-value">{vehicle.seats ? `202${Math.floor(Math.random() * 5)}` : "2023"}</span>
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

          {/* Verification Protocol */}
          <div className="mt-auto pt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-red" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Technical Verification Active</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-white/10" />
          </div>

          {/* Red Progress Indicator */}
          <div className="w-12 h-1 bg-primary/20 mt-4 overflow-hidden">
            <div className="w-full h-full bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </div>
        </div>
      </div>

      <RentalModal
        isOpen={showRentalModal}
        onClose={() => setShowRentalModal(false)}
        vehicle={vehicle}
      />
    </>
  );
};

export default FeaturedVehicleCard;
