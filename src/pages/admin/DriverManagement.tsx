import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  User,
  Phone,
  Mail,
  Loader2,
  Activity,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Driver {
  id: string;
  driver_id_jck: string;
  driver_name: string;
  phone_number: string;
  email: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = ["available", "assigned", "off-duty"];

const DriverManagement = () => {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isSubmitting, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    driver_name: "",
    phone_number: "",
    email: "",
    status: "available",
    custom_id_suffix: ""
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch driver registry", variant: "destructive" });
    } else {
      setDrivers(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const driverIdJck = editingDriver
      ? editingDriver.driver_id_jck
      : `${formData.driver_name.split(' ')[0]}-DR${formData.custom_id_suffix || Math.floor(Math.random() * 100).toString().padStart(2, '0')}/JCK`;

    const driverData = {
      driver_name: formData.driver_name,
      phone_number: formData.phone_number,
      email: formData.email,
      status: formData.status,
      driver_id_jck: driverIdJck
    };

    if (editingDriver) {
      const { error } = await supabase
        .from("drivers")
        .update(driverData)
        .eq("id", editingDriver.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update driver personnel", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Personnel records updated" });
        fetchDrivers();
        closeModal();
      }
    } else {
      const { error } = await supabase
        .from("drivers")
        .insert([driverData]);

      if (error) {
        toast({ title: "Error", description: "Failed to register driver", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "New personnel deployed to registry" });
        fetchDrivers();
        closeModal();
      }
    }
    setIsSaving(false);
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      driver_name: driver.driver_name,
      phone_number: driver.phone_number,
      email: driver.email,
      status: driver.status,
      custom_id_suffix: driver.driver_id_jck.split('DR')[1].split('/')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm decommissioning of this personnel from active registry?")) return;

    const { error } = await supabase
      .from("drivers")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete personnel", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Personnel removed from registry" });
      fetchDrivers();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDriver(null);
    setFormData({
      driver_name: "",
      phone_number: "",
      email: "",
      status: "available",
      custom_id_suffix: ""
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Syncing Personnel Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Personnel Management</h2>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Active Driver Command Center</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-scan flex items-center gap-3"
        >
          <Plus className="w-4 h-4" />
          Deploy New Personnel
        </button>
      </div>

      {drivers.length === 0 ? (
        <div className="p-16 border border-dashed border-white/10 rounded-sm text-center">
          <User className="w-12 h-12 text-white/10 mx-auto mb-6" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">No Active Personnel Registered</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-outline-terminal px-10"
          >
            Register First Driver
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div key={driver.id} className="unit-card group">
              <div className="p-8 bg-black relative overflow-hidden">
                {/* Visual Status Indicator */}
                <div className="absolute top-0 right-0 p-4">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${
                     driver.status === 'available' ? 'bg-green-500' : driver.status === 'assigned' ? 'bg-yellow-500' : 'bg-white/20'
                   }`} />
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">{driver.driver_name}</h3>
                    <p className="text-[10px] font-mono text-primary font-bold mt-1">{driver.driver_id_jck}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-white/40">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{driver.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/40">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono uppercase tracking-widest truncate">{driver.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className={`px-3 py-1 border rounded-sm text-[8px] font-black uppercase tracking-[0.2em] ${
                    driver.status === 'available' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    driver.status === 'assigned' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    'bg-white/5 text-white/30 border-white/10'
                  }`}>
                    {driver.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(driver)}
                      className="p-2.5 border border-white/10 bg-white/5 hover:bg-primary hover:text-white transition-all rounded-sm"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="p-2.5 border border-red-500/10 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Driver Deployment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-black border border-white/10 rounded-sm w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black uppercase tracking-widest text-white">
                  {editingDriver ? "Update Personnel Data" : "Deploy New Personnel"}
                </h3>
              </div>
              <button onClick={closeModal} className="p-2 text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
               <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">01 // Identity Modules</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.driver_name}
                      onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                      className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-6 text-white uppercase"
                      placeholder="ENTER PERSONNEL NAME"
                    />
                  </div>

                  {!editingDriver && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Driver ID Suffix (Optional)</label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={2}
                          value={formData.custom_id_suffix}
                          onChange={(e) => setFormData({ ...formData, custom_id_suffix: e.target.value })}
                          className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-6 text-white uppercase"
                          placeholder="01"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-mono text-white/20">Format: [NAME]-DRXX/JCK</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">02 // Communication Nodes</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Phone Line</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input
                        type="tel"
                        required
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none pl-14 text-white uppercase"
                        placeholder="07XX XXX XXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Secure Email</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none pl-14 text-white uppercase"
                        placeholder="NAME@JUSTICELOGISTICS.COM"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">03 // Status Configuration</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Deployment Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-6 text-white uppercase"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status} className="bg-black">{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-10 sticky bottom-0 bg-black py-4">
                <button type="button" onClick={closeModal} className="flex-1 btn-outline-terminal h-16 uppercase tracking-[0.4em]">Abort</button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-scan h-16 uppercase tracking-[0.4em] flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  {editingDriver ? "Verify Update" : "Confirm Deployment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
