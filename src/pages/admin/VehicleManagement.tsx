import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Upload,
  Car,
  Loader2,
  Star
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
  seats: number;
  fuel_type: string;
  transmission: string;
  status: string;
  is_featured: boolean;
}

const categories = ["SUV", "Sedan", "Hatchback", "Van", "Luxury", "4x4"];

const VehicleManagement = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "SUV",
    price_per_day: 0,
    image_url: "",
    description: "",
    features: "",
    seats: 5,
    fuel_type: "Petrol",
    transmission: "Automatic",
    status: "available"
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch vehicles", variant: "destructive" });
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("vehicle-images")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("vehicle-images")
      .getPublicUrl(fileName);

    setFormData({ ...formData, image_url: publicUrl });
    setUploading(false);
    toast({ title: "Success", description: "Image uploaded successfully" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData = {
      name: formData.name,
      category: formData.category,
      price_per_day: formData.price_per_day,
      image_url: formData.image_url || null,
      description: formData.description || null,
      features: formData.features ? formData.features.split(",").map(f => f.trim()) : null,
      seats: formData.seats,
      fuel_type: formData.fuel_type,
      transmission: formData.transmission,
      status: formData.status
    };

    if (editingVehicle) {
      const { error } = await supabase
        .from("vehicles")
        .update(vehicleData)
        .eq("id", editingVehicle.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update vehicle", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Vehicle updated successfully" });
        fetchVehicles();
        closeModal();
      }
    } else {
      const { error } = await supabase
        .from("vehicles")
        .insert([vehicleData]);

      if (error) {
        toast({ title: "Error", description: "Failed to add vehicle", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Vehicle added successfully" });
        fetchVehicles();
        closeModal();
      }
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      category: vehicle.category,
      price_per_day: vehicle.price_per_day,
      image_url: vehicle.image_url || "",
      description: vehicle.description || "",
      features: vehicle.features?.join(", ") || "",
      seats: vehicle.seats,
      fuel_type: vehicle.fuel_type,
      transmission: vehicle.transmission,
      status: vehicle.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete vehicle", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Vehicle deleted successfully" });
      fetchVehicles();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setFormData({
      name: "",
      category: "SUV",
      price_per_day: 0,
      image_url: "",
      description: "",
      features: "",
      seats: 5,
      fuel_type: "Petrol",
      transmission: "Automatic",
      status: "available"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Vehicle Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary-gradient flex items-center gap-2 px-4 py-2"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg font-medium mb-2">No vehicles yet</p>
          <p className="text-muted-foreground mb-4">Add your first vehicle to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary-gradient px-6 py-2"
          >
            Add Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="glass-card overflow-hidden">
              <div className="h-48 bg-muted relative">
                {vehicle.image_url ? (
                  <img 
                    src={vehicle.image_url} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                  vehicle.status === "available" ? "bg-green-500/20 text-green-500" :
                  vehicle.status === "booked" ? "bg-yellow-500/20 text-yellow-500" :
                  "bg-red-500/20 text-red-500"
                }`}>
                  {vehicle.status}
                </span>
                {vehicle.is_featured && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-lg mb-1">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{vehicle.category}</p>
                <p className="text-primary font-bold mb-4">KSh {vehicle.price_per_day.toLocaleString()}/day</p>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await supabase.from("vehicles").update({ is_featured: !vehicle.is_featured }).eq("id", vehicle.id);
                      fetchVehicles();
                    }}
                    className={`glass-button py-2 px-3 ${vehicle.is_featured ? "text-yellow-500" : "text-muted-foreground"}`}
                    title={vehicle.is_featured ? "Remove from featured" : "Add to featured"}
                  >
                    <Star className={`w-4 h-4 ${vehicle.is_featured ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="flex-1 glass-button py-2 flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="glass-button py-2 px-4 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />
          <div className="relative bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold">
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Image</label>
                <div className="flex items-center gap-4">
                  {formData.image_url && (
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <label className="glass-button px-4 py-2 cursor-pointer flex items-center gap-2">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="glass-input"
                    placeholder="e.g., Toyota Prado TX"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="glass-input"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price per Day (KSh) *</label>
                  <input
                    type="number"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: Number(e.target.value) })}
                    required
                    min="0"
                    className="glass-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="glass-input"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Seats</label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                    min="1"
                    max="20"
                    className="glass-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fuel Type</label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                    className="glass-input"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="glass-input"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="glass-input"
                  placeholder="e.g., AC, GPS, Bluetooth, Leather Seats"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="glass-input resize-none"
                  placeholder="Brief description of the vehicle..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 glass-button py-3">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary-gradient py-3">
                  {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
