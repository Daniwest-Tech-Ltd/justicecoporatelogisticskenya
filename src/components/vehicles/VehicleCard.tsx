import { Link } from "react-router-dom";
import { Users, Fuel, Settings, Eye, MessageCircle } from "lucide-react";
import { Vehicle } from "@/data/vehicles";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  const getStatusBadge = () => {
    if (vehicle.status === "booked") {
      return <span className="badge-booked">⛔ Booked</span>;
    }
    if (vehicle.isPopular) {
      return <span className="badge-popular">🔥 Popular</span>;
    }
    if (vehicle.isExecutive) {
      return <span className="badge-available">⭐ Executive</span>;
    }
    return <span className="badge-available">✅ Available</span>;
  };

  return (
    <div className="glass-card-hover group overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>
        <div className="absolute top-3 right-3 glass-card px-2 py-1 text-xs font-medium">
          {vehicle.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-heading font-semibold text-lg mb-3 line-clamp-1">
          {vehicle.name}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{vehicle.fuel}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="price-tag">
            <span className="currency">KSh</span>
            <span className="amount">{formatPrice(vehicle.pricePerDay)}</span>
            <span className="period">/ Day</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Driver: + KSh {formatPrice(vehicle.driverFee)}/day (Optional)
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="flex-1 glass-button flex items-center justify-center gap-2 py-2.5 text-sm"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Link>
          {vehicle.status === "available" ? (
            <Link
              to={`/book/${vehicle.id}`}
              className="flex-1 btn-primary-gradient flex items-center justify-center gap-2 py-2.5 text-sm"
            >
              Rent Now
            </Link>
          ) : (
            <a
              href="https://wa.me/254702575512"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 glass-button flex items-center justify-center gap-2 py-2.5 text-sm hover:bg-green-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              Inquire
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
