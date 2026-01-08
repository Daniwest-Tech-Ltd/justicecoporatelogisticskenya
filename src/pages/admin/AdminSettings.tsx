import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  User, 
  Save, 
  Bell, 
  Shield, 
  Mail, 
  Phone,
  Building,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  
  // System settings
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
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your profile and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary/20">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="mt-1.5 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed from here
              </p>
            </div>

            <div>
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="mt-1.5"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="btn-primary-gradient w-full flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {/* System Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Settings className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">System Settings</h3>
              <p className="text-sm text-muted-foreground">Configure system behavior</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive order updates via email</p>
                </div>
              </div>
              <Switch
                checked={systemSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSystemSettings({ ...systemSettings, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive order updates via SMS</p>
                </div>
              </div>
              <Switch
                checked={systemSettings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSystemSettings({ ...systemSettings, smsNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Auto-Approve Orders</p>
                  <p className="text-sm text-muted-foreground">Automatically approve new orders</p>
                </div>
              </div>
              <Switch
                checked={systemSettings.autoApproveOrders}
                onCheckedChange={(checked) =>
                  setSystemSettings({ ...systemSettings, autoApproveOrders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Disable public access temporarily</p>
                </div>
              </div>
              <Switch
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSystemSettings({ ...systemSettings, maintenanceMode: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Building className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">Business Information</h3>
              <p className="text-sm text-muted-foreground">Your company details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Company Name</p>
              <p className="font-medium">Justice Corporate Logistics Kenya</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Contact Email</p>
              <p className="font-medium">rentals@justicelogisticskenya.com</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">0702575512</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">Mpesi Lane 11, Westlands, Nairobi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
