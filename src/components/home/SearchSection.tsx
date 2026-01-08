import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Car } from "lucide-react";

const locations = [
  "Nairobi CBD",
  "Westlands",
  "JKIA Airport",
  "Karen",
  "Nyeri",
  "Mombasa",
];

const vehicleTypes = [
  "All Types",
  "SUV",
  "Sedan",
  "Van",
  "Luxury",
  "4x4",
];

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    pickupDate: "",
    returnDate: "",
    vehicleType: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/catalogue", { state: searchData });
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <form onSubmit={handleSearch} className="glass-card p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Pickup Location
              </label>
              <select
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="glass-input"
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Pickup Date
              </label>
              <input
                type="date"
                value={searchData.pickupDate}
                onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
                className="glass-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Return Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Return Date
              </label>
              <input
                type="date"
                value={searchData.returnDate}
                onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                className="glass-input"
                min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                Vehicle Type
              </label>
              <select
                value={searchData.vehicleType}
                onChange={(e) => setSearchData({ ...searchData, vehicleType: e.target.value })}
                className="glass-input"
              >
                <option value="">Select Type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button type="submit" className="btn-primary-gradient w-full flex items-center justify-center gap-2 py-3.5">
                <Search className="w-5 h-5" />
                Search Rentals
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
