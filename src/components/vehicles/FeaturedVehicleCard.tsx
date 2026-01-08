import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Fuel, Settings, Eye } from "lucide-react";
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
      <div className="glass-card-hover group overflow-hidden">
        {/* Image */}
        <Link to={`/vehicle/${vehicle.id}`} className="block">
          <div className="relative h-48 overflow-hidden bg-muted">
            {vehicle.image_url ? (
              <img
                src={vehicle.image_url}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="badge-available">✅ Available</span>
            </div>
            <div className="absolute top-3 right-3 glass-card px-2 py-1 text-xs font-medium text-foreground">
              {vehicle.category}
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <Link to={`/vehicle/${vehicle.id}`}>
            <h3 className="font-heading font-semibold text-lg mb-3 line-clamp-1 text-foreground hover:text-primary transition-colors">
              {vehicle.name}
            </h3>
          </Link>

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{vehicle.seats || 5} Seats</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              <span>{vehicle.transmission || "Auto"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>{vehicle.fuel_type || "Petrol"}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="price-tag">
              <span className="currency">KSh</span>
              <span className="amount">{formatPrice(vehicle.price_per_day)}</span>
              <span className="period">/ Day</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              to={`/vehicle/${vehicle.id}`}
              className="flex-1 glass-button flex items-center justify-center gap-2 py-2.5 text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
            <button
              onClick={() => setShowRentalModal(true)}
              className="flex-1 btn-primary-gradient flex items-center justify-center gap-2 py-2.5 text-sm"
            >
              Rent Now
            </button>
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
