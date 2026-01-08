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
  Star,
  Image as ImageIcon
} from "lucide-react";

interface LookupItem {
  id: string;
  name: string;
}

interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order: number;
}

interface Vehicle {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  price_per_week: number | null;
  price_per_month: number | null;
  driver_fee: number | null;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
  seats: number;
  fuel_type: string;
  transmission: string;
  status: string;
  is_featured: boolean;
  brand_id: string | null;
  model: string | null;
  vehicle_type_id: string | null;
  fuel_type_id: string | null;
  transmission_id: string | null;
  color_id: string | null;
  body_type_id: string | null;
  drive_type_id: string | null;
  rental_type_id: string | null;
  condition_id: string | null;
  engine_cc: number | null;
  year: number | null;
}

const ENGINE_CC_OPTIONS = [
  "1000", "1200", "1300", "1500", "1800", "2000", "2200", "2400", 
  "2500", "2700", "2800", "3000", "3500", "4000", "4600", "5000"
];

const STATUS_OPTIONS = [
  "Available", "Booked", "Under Maintenance", "Sold", "Reserved"
];

const VehicleManagement = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);

  // Lookup data
  const [brands, setBrands] = useState<LookupItem[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<LookupItem[]>([]);
  const [fuelTypes, setFuelTypes] = useState<LookupItem[]>([]);
  const [transmissions, setTransmissions] = useState<LookupItem[]>([]);
  const [colors, setColors] = useState<LookupItem[]>([]);
  const [bodyTypes, setBodyTypes] = useState<LookupItem[]>([]);
  const [driveTypes, setDriveTypes] = useState<LookupItem[]>([]);
  const [rentalTypes, setRentalTypes] = useState<LookupItem[]>([]);
  const [conditions, setConditions] = useState<LookupItem[]>([]);

  // Multiple images
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    category: "",
    price_per_day: 0,
    price_per_week: 0,
    price_per_month: 0,
    driver_fee: 0,
    image_url: "",
    description: "",
    features: "",
    seats: 5,
    status: "Available",
    brand_id: "",
    vehicle_type_id: "",
    fuel_type_id: "",
    transmission_id: "",
    color_id: "",
    body_type_id: "",
    drive_type_id: "",
    rental_type_id: "",
    condition_id: "",
    engine_cc: "",
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchVehicles();
    fetchLookupData();
  }, []);

  const fetchLookupData = async () => {
    const [
      brandsRes,
      vehicleTypesRes,
      fuelTypesRes,
      transmissionsRes,
      colorsRes,
      bodyTypesRes,
      driveTypesRes,
      rentalTypesRes,
      conditionsRes
    ] = await Promise.all([
      supabase.from("brands").select("*").order("name"),
      supabase.from("vehicle_types").select("*").order("name"),
      supabase.from("fuel_types").select("*").order("name"),
      supabase.from("transmissions").select("*").order("name"),
      supabase.from("colors").select("*").order("name"),
      supabase.from("body_types").select("*").order("name"),
      supabase.from("drive_types").select("*").order("name"),
      supabase.from("rental_types").select("*").order("name"),
      supabase.from("conditions").select("*").order("name")
    ]);

    if (brandsRes.data) setBrands(brandsRes.data);
    if (vehicleTypesRes.data) setVehicleTypes(vehicleTypesRes.data);
    if (fuelTypesRes.data) setFuelTypes(fuelTypesRes.data);
    if (transmissionsRes.data) setTransmissions(transmissionsRes.data);
    if (colorsRes.data) setColors(colorsRes.data);
    if (bodyTypesRes.data) setBodyTypes(bodyTypesRes.data);
    if (driveTypesRes.data) setDriveTypes(driveTypesRes.data);
    if (rentalTypesRes.data) setRentalTypes(rentalTypesRes.data);
    if (conditionsRes.data) setConditions(conditionsRes.data);
  };

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

  const fetchVehicleImages = async (vehicleId: string) => {
    const { data } = await supabase
      .from("vehicle_images")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("display_order");
    
    if (data) {
      setExistingImages(data);
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentTotal = vehicleImages.length + existingImages.length;
    const availableSlots = 8 - currentTotal;

    if (files.length > availableSlots) {
      toast({ 
        title: "Limit Reached", 
        description: `You can only add ${availableSlots} more images (max 8 total)`, 
        variant: "destructive" 
      });
      return;
    }

    setUploadingMultiple(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(fileName, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("vehicle-images")
          .getPublicUrl(fileName);
        newUrls.push(publicUrl);
      }
    }

    setVehicleImages([...vehicleImages, ...newUrls]);
    setUploadingMultiple(false);
    toast({ title: "Success", description: `${newUrls.length} images uploaded` });
  };

  const removeImage = (index: number) => {
    setVehicleImages(vehicleImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    await supabase.from("vehicle_images").delete().eq("id", imageId);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
    toast({ title: "Image removed" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData = {
      name: formData.name || `${brands.find(b => b.id === formData.brand_id)?.name || ''} ${formData.model}`.trim(),
      model: formData.model || null,
      category: vehicleTypes.find(v => v.id === formData.vehicle_type_id)?.name || formData.category || "SUV",
      price_per_day: formData.price_per_day,
      price_per_week: formData.price_per_week || null,
      price_per_month: formData.price_per_month || null,
      driver_fee: formData.driver_fee || null,
      image_url: formData.image_url || vehicleImages[0] || null,
      description: formData.description || null,
      features: formData.features ? formData.features.split(",").map(f => f.trim()) : null,
      seats: formData.seats,
      fuel_type: fuelTypes.find(f => f.id === formData.fuel_type_id)?.name || "Petrol",
      transmission: transmissions.find(t => t.id === formData.transmission_id)?.name || "Automatic",
      status: formData.status.toLowerCase(),
      brand_id: formData.brand_id || null,
      vehicle_type_id: formData.vehicle_type_id || null,
      fuel_type_id: formData.fuel_type_id || null,
      transmission_id: formData.transmission_id || null,
      color_id: formData.color_id || null,
      body_type_id: formData.body_type_id || null,
      drive_type_id: formData.drive_type_id || null,
      rental_type_id: formData.rental_type_id || null,
      condition_id: formData.condition_id || null,
      engine_cc: formData.engine_cc ? parseInt(formData.engine_cc) : null,
      year: formData.year || null
    };

    if (editingVehicle) {
      const { error } = await supabase
        .from("vehicles")
        .update(vehicleData)
        .eq("id", editingVehicle.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update vehicle", variant: "destructive" });
        return;
      }

      // Add new images
      if (vehicleImages.length > 0) {
        const imageInserts = vehicleImages.map((url, index) => ({
          vehicle_id: editingVehicle.id,
          image_url: url,
          display_order: existingImages.length + index
        }));
        await supabase.from("vehicle_images").insert(imageInserts);
      }

      toast({ title: "Success", description: "Vehicle updated successfully" });
      fetchVehicles();
      closeModal();
    } else {
      const { data, error } = await supabase
        .from("vehicles")
        .insert([vehicleData])
        .select()
        .single();

      if (error) {
        toast({ title: "Error", description: "Failed to add vehicle", variant: "destructive" });
        return;
      }

      // Add images
      if (vehicleImages.length > 0 && data) {
        const imageInserts = vehicleImages.map((url, index) => ({
          vehicle_id: data.id,
          image_url: url,
          display_order: index
        }));
        await supabase.from("vehicle_images").insert(imageInserts);
      }

      toast({ title: "Success", description: "Vehicle added successfully" });
      fetchVehicles();
      closeModal();
    }
  };

  const handleEdit = async (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    await fetchVehicleImages(vehicle.id);
    setFormData({
      name: vehicle.name,
      model: vehicle.model || "",
      category: vehicle.category,
      price_per_day: vehicle.price_per_day,
      price_per_week: vehicle.price_per_week || 0,
      price_per_month: vehicle.price_per_month || 0,
      driver_fee: vehicle.driver_fee || 0,
      image_url: vehicle.image_url || "",
      description: vehicle.description || "",
      features: vehicle.features?.join(", ") || "",
      seats: vehicle.seats,
      status: vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1),
      brand_id: vehicle.brand_id || "",
      vehicle_type_id: vehicle.vehicle_type_id || "",
      fuel_type_id: vehicle.fuel_type_id || "",
      transmission_id: vehicle.transmission_id || "",
      color_id: vehicle.color_id || "",
      body_type_id: vehicle.body_type_id || "",
      drive_type_id: vehicle.drive_type_id || "",
      rental_type_id: vehicle.rental_type_id || "",
      condition_id: vehicle.condition_id || "",
      engine_cc: vehicle.engine_cc?.toString() || "",
      year: vehicle.year || new Date().getFullYear()
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
    setVehicleImages([]);
    setExistingImages([]);
    setFormData({
      name: "",
      model: "",
      category: "",
      price_per_day: 0,
      price_per_week: 0,
      price_per_month: 0,
      driver_fee: 0,
      image_url: "",
      description: "",
      features: "",
      seats: 5,
      status: "Available",
      brand_id: "",
      vehicle_type_id: "",
      fuel_type_id: "",
      transmission_id: "",
      color_id: "",
      body_type_id: "",
      drive_type_id: "",
      rental_type_id: "",
      condition_id: "",
      engine_cc: "",
      year: new Date().getFullYear()
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
          <div className="relative bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold">
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Main Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Main Vehicle Image</label>
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
                    {uploading ? "Uploading..." : "Upload Main Image"}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Multiple Images Upload (Up to 8) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Gallery Images (up to 8)</label>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img 
                        src={img.image_url} 
                        alt="Vehicle" 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {vehicleImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt={`New ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded-lg border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(vehicleImages.length + existingImages.length) < 8 && (
                    <label className="w-20 h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      {uploadingMultiple ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={handleMultipleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {8 - vehicleImages.length - existingImages.length} slots remaining
                </p>
              </div>

              {/* Brand & Model */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand *</label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="glass-input"
                    placeholder="e.g., Land Cruiser Prado"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input"
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              {/* Vehicle Type, Body Type, Condition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle Type</label>
                  <select
                    value={formData.vehicle_type_id}
                    onChange={(e) => setFormData({ ...formData, vehicle_type_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Body Type</label>
                  <select
                    value={formData.body_type_id}
                    onChange={(e) => setFormData({ ...formData, body_type_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Body Type</option>
                    {bodyTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Condition</label>
                  <select
                    value={formData.condition_id}
                    onChange={(e) => setFormData({ ...formData, condition_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition.id} value={condition.id}>{condition.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color, Year, Engine CC */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <select
                    value={formData.color_id}
                    onChange={(e) => setFormData({ ...formData, color_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Color</option>
                    {colors.map((color) => (
                      <option key={color.id} value={color.id}>{color.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    className="glass-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Engine (CC)</label>
                  <select
                    value={formData.engine_cc}
                    onChange={(e) => setFormData({ ...formData, engine_cc: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Engine CC</option>
                    {ENGINE_CC_OPTIONS.map((cc) => (
                      <option key={cc} value={cc}>{cc} CC</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fuel, Transmission, Drive Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fuel Type</label>
                  <select
                    value={formData.fuel_type_id}
                    onChange={(e) => setFormData({ ...formData, fuel_type_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.map((fuel) => (
                      <option key={fuel.id} value={fuel.id}>{fuel.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transmission</label>
                  <select
                    value={formData.transmission_id}
                    onChange={(e) => setFormData({ ...formData, transmission_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Transmission</option>
                    {transmissions.map((trans) => (
                      <option key={trans.id} value={trans.id}>{trans.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Drive Type</label>
                  <select
                    value={formData.drive_type_id}
                    onChange={(e) => setFormData({ ...formData, drive_type_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Drive Type</option>
                    {driveTypes.map((drive) => (
                      <option key={drive.id} value={drive.id}>{drive.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rental Type, Status, Seats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rental Type</label>
                  <select
                    value={formData.rental_type_id}
                    onChange={(e) => setFormData({ ...formData, rental_type_id: e.target.value })}
                    className="glass-input"
                  >
                    <option value="">Select Rental Type</option>
                    {rentalTypes.map((rental) => (
                      <option key={rental.id} value={rental.id}>{rental.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="glass-input"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Seats</label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                    min="1"
                    max="50"
                    className="glass-input"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price/Day (KSh) *</label>
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
                  <label className="text-sm font-medium">Price/Week (KSh)</label>
                  <input
                    type="number"
                    value={formData.price_per_week}
                    onChange={(e) => setFormData({ ...formData, price_per_week: Number(e.target.value) })}
                    min="0"
                    className="glass-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price/Month (KSh)</label>
                  <input
                    type="number"
                    value={formData.price_per_month}
                    onChange={(e) => setFormData({ ...formData, price_per_month: Number(e.target.value) })}
                    min="0"
                    className="glass-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Driver Fee (KSh)</label>
                  <input
                    type="number"
                    value={formData.driver_fee}
                    onChange={(e) => setFormData({ ...formData, driver_fee: Number(e.target.value) })}
                    min="0"
                    className="glass-input"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="glass-input"
                  placeholder="e.g., AC, GPS, Bluetooth, Leather Seats, Sunroof"
                />
              </div>

              {/* Description */}
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
