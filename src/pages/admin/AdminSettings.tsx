import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  User, 
  Save, 
  Shield,
  Mail, 
  Phone,
  Building,
  Clock,
  Zap,
  Activity,
  Fingerprint
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AdminProfile {
  full_name: string;
  phone: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<AdminProfile>({
    full_name: "",
    phone: "",
  });
  
  const [systemSettings, setSystemSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoApproveOrders: false,
    maintenanceMode: false,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile Synchronized",
        description: "Your personnel metadata has been updated in the registry.",
      });
    } catch (error) {
      toast({
        title: "Synchronization Error",
        description: "Failed to update profile registry node.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">System Configuration</h2>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Admin Control & Registry Protocols</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personnel Registry Profile */}
        <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-8 bg-primary group-hover:h-full transition-all duration-700" />
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm text-primary">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Personnel Metadata</h3>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Operator Identity Parameters</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Authentication Node (Read Only)</label>
              <input value={user?.email || ""} disabled className="audit-input w-full h-12 bg-white/5 border border-white/10 rounded-sm px-6 text-[11px] text-white/40 font-mono uppercase" />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Personnel Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-[11px] text-white uppercase outline-none focus:border-primary/50"
                placeholder="ENTER FULL LEGAL NAME"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Operational Phone Node</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-[11px] text-white uppercase outline-none focus:border-primary/50"
                placeholder="ENTER COMMS CODE"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full btn-scan h-14 flex items-center justify-center gap-3 disabled:opacity-30"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "SYNCHRONIZING..." : "EXECUTE REGISTRY UPDATE"}
            </button>
          </div>
        </div>

        {/* System Protocol Logic */}
        <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-8 bg-green-500 group-hover:h-full transition-all duration-700" />
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm text-green-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">System Protocol Logic</h3>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Automation & Alert Matrices</p>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { id: "EMAIL_ALERT", label: "Email Notifications", sub: "Global order update transmission", checked: systemSettings.emailNotifications, key: "emailNotifications" },
              { id: "SMS_ALERT", label: "SMS Notifications", sub: "Operational code transmission", checked: systemSettings.smsNotifications, key: "smsNotifications" },
              { id: "AUTO_DISP", label: "Auto-Approve Orders", sub: "Zero-touch deployment authorization", checked: systemSettings.autoApproveOrders, key: "autoApproveOrders" },
              { id: "MTN_LOCK", label: "Maintenance Mode", sub: "Public terminal access override", checked: systemSettings.maintenanceMode, key: "maintenanceMode" },
            ].map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all rounded-sm group/row">
                <div className="flex items-center gap-4">
                  <div className="text-[8px] font-mono text-white/20 group-hover/row:text-primary transition-colors">{s.id}</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">{s.label}</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/30">{s.sub}</p>
                  </div>
                </div>
                <Switch
                  checked={s.checked}
                  onCheckedChange={(checked) =>
                    setSystemSettings({ ...systemSettings, [s.key]: checked })
                  }
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Hub Info */}
        <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5"><Building className="w-24 h-24" /></div>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm text-blue-500">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Institutional Hub Intelligence</h3>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Global Corporate Metadata</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Entity Name", value: "Justice Corporate Logistics Kenya", id: "ENT_NAME" },
              { label: "Strategic Node", value: "rentals@justicelogisticskenya.com", id: "ENT_NODE" },
              { label: "Dispatch Code", value: "0702575512", id: "ENT_CODE" },
              { label: "Terminal Loc", value: "Occidental Plaza, Westlands", id: "ENT_ZONE" },
            ].map((item) => (
              <div key={item.id} className="p-6 border border-white/5 bg-white/[0.01] rounded-sm group/item hover:border-primary/20 transition-all">
                <span className="block text-[8px] font-mono text-white/20 uppercase tracking-widest mb-3">{item.id}</span>
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/30 mb-1">{item.label}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
