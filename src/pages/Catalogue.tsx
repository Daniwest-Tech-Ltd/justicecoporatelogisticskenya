import { useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { vehicles, categories } from "@/data/vehicles";
import { Search, SlidersHorizontal } from "lucide-react";

const Catalogue = () => {
  const location = useLocation();
  const searchState = location.state as { vehicleType?: string } | null;
  
  const [selectedCategory, setSelectedCategory] = useState(searchState?.vehicleType || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesCategory = selectedCategory === "All" || vehicle.category === selectedCategory;
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = vehicle.pricePerDay >= priceRange[0] && vehicle.pricePerDay <= priceRange[1];
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesCategory && matchesSearch && matchesPrice && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">Rental Catalogue</h1>
          <p className="section-subtitle mx-auto">
            Browse our complete fleet of premium rental vehicles
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="glass-card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="glass-button flex items-center justify-center gap-2 md:w-auto"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range (KSh/Day)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="glass-input"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="glass-input"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="glass-input"
                >
                  <option value="all">All Vehicles</option>
                  <option value="available">Available Only</option>
                  <option value="booked">Booked</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setPriceRange([0, 50000]);
                    setStatusFilter("all");
                  }}
                  className="glass-button w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === category
                  ? "btn-primary-gradient"
                  : "glass-button"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          Showing {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? "s" : ""}
        </p>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="tile-grid">
            {filteredVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-xl font-medium mb-2">No vehicles found</p>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalogue;
