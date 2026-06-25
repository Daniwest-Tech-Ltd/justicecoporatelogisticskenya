import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Mail, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  Package,
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import logo from "@/assets/logo.png";
import VehicleManagement from "./VehicleManagement";
import MessageInbox from "./MessageInbox";
import OrderManagement from "./OrderManagement";
import UserManagement from "./UserManagement";
import AdminSettings from "./AdminSettings";
import DashboardAnalytics from "./DashboardAnalytics";

interface DashboardStats {
  totalUsers: number;
  totalVehicles: number;
  totalMessages: number;
  unreadMessages: number;
  pendingOrders: number;
}

interface Vehicle {
  id: string;
  name: string;
  image_url: string | null;
  status: string;
  price_per_day: number;
}

interface User {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    vehicles: Vehicle[];
    users: User[];
  }>({ vehicles: [], users: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVehicles: 0,
    totalMessages: 0,
    unreadMessages: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults({ vehicles: [], users: [] });
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const fetchStats = async () => {
    try {
      const [usersRes, vehiclesRes, messagesRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("rental_orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      const { count: unreadCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      setStats({
        totalUsers: usersRes.count || 0,
        totalVehicles: vehiclesRes.count || 0,
        totalMessages: messagesRes.count || 0,
        unreadMessages: unreadCount || 0,
        pendingOrders: ordersRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentData = async () => {
    try {
      const [vehiclesRes, usersRes] = await Promise.all([
        supabase.from("vehicles").select("id, name, image_url, status, price_per_day").order("created_at", { ascending: false }).limit(5),
        supabase.from("profiles").select("id, full_name, phone, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      if (vehiclesRes.data) setRecentVehicles(vehiclesRes.data);
      if (usersRes.data) setRecentUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching recent data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const [vehiclesRes, usersRes] = await Promise.all([
        supabase
          .from("vehicles")
          .select("id, name, image_url, status, price_per_day")
          .ilike("name", `%${searchQuery}%`)
          .limit(5),
        supabase
          .from("profiles")
          .select("id, full_name, phone, created_at")
          .or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
          .limit(5),
      ]);

      setSearchResults({
        vehicles: vehiclesRes.data || [],
        users: usersRes.data || [],
      });
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleStatCardClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
    { name: "Analytics", icon: TrendingUp, id: "analytics" },
    { name: "Orders", icon: Package, id: "orders", badge: stats.pendingOrders },
    { name: "Vehicles", icon: Car, id: "vehicles", badge: stats.totalVehicles },
    { name: "Messages", icon: Mail, id: "messages", badge: stats.unreadMessages },
    { name: "Users", icon: Users, id: "users" },
    { name: "Settings", icon: Settings, id: "settings" },
  ];

  const statCards = [
    { 
      title: "Active Personnel",
      value: stats.totalUsers.toString(), 
      icon: Users, 
      color: "text-blue-500",
      id: "USERS_NODE",
      tabId: "users"
    },
    { 
      title: "Strategic Units",
      value: stats.totalVehicles.toString(), 
      icon: Car, 
      color: "text-green-500",
      id: "ASSET_NODE",
      tabId: "vehicles"
    },
    { 
      title: "Secure Messages",
      value: stats.totalMessages.toString(), 
      icon: Mail, 
      color: "text-yellow-500",
      id: "COMM_NODE",
      tabId: "messages"
    },
    { 
      title: "Pending Missions",
      value: stats.pendingOrders.toString(), 
      icon: Package, 
      color: "text-primary",
      id: "MISSION_NODE",
      tabId: "orders"
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  const renderDashboardHome = () => (
    <div className="space-y-8 animate-fade-up">
      {/* Clickable Stat Data Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <button
            key={card.title}
            onClick={() => handleStatCardClick(card.tabId)}
            className="p-6 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm hover:border-primary/50 transition-all group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
            <div className="flex items-center justify-between mb-6">
              <div className={`w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{card.id}</span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{card.value}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{card.title}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vehicles Terminal */}
        <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Recent Asset Deployment</h3>
            </div>
            <button
              onClick={() => setActiveTab("vehicles")}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:underline flex items-center gap-2"
            >
              Full Registry <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {recentVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center gap-4 p-3 border border-white/5 bg-white/[0.02] rounded-sm hover:bg-white/[0.05] transition-all">
                <div className="w-12 h-12 rounded-sm overflow-hidden bg-white/5 flex-shrink-0">
                  {vehicle.image_url ? (
                    <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover grayscale-[0.5]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-[8px]">N/A</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white truncate">{vehicle.name}</p>
                  <p className="text-[9px] font-mono text-white/30 uppercase">KSh {formatPrice(vehicle.price_per_day)} / Day</p>
                </div>
                <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-sm ${
                  vehicle.status === "available" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}>
                  {vehicle.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Personnel Registry */}
        <div className="p-8 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Personnel Registry Activity</h3>
            </div>
            <button
              onClick={() => setActiveTab("users")}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:underline flex items-center gap-2"
            >
              Full Directory <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-3 border border-white/5 bg-white/[0.02] rounded-sm hover:bg-white/[0.05] transition-all">
                <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white truncate">{user.full_name || "Unidentified Personnel"}</p>
                  <p className="text-[9px] font-mono text-white/30 uppercase">{user.phone || "No Operational Code"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-mono text-white/20 uppercase">Registered</p>
                  <p className="text-[9px] font-bold text-white/40 uppercase">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Quick Execution */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { tab: "analytics", icon: TrendingUp, label: "Audit Intelligence" },
          { tab: "orders", icon: Package, label: "Dispatch Management" },
          { tab: "vehicles", icon: Car, label: "Asset Deployment" },
          { tab: "messages", icon: Mail, label: "Secure Comms" },
        ].map((action) => (
          <button
            key={action.tab}
            onClick={() => setActiveTab(action.tab)}
            className="p-4 flex items-center gap-4 border border-white/5 bg-white/[0.02] hover:bg-primary hover:border-primary transition-all rounded-sm group"
          >
            <action.icon className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <DashboardAnalytics />;
      case "orders":
        return <OrderManagement />;
      case "vehicles":
        return <VehicleManagement />;
      case "messages":
        return <MessageInbox />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <AdminSettings />;
      default:
        return renderDashboardHome();
    }
  };

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Background Visual Asset */}
      <div className="fixed inset-0 z-0">
        <img
          src="/rental 2.png"
          alt="Dashboard Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
      </div>

      {/* Sidebar Interface */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-black/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-500 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-24"
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-tighter text-white leading-none">Justice Admin</span>
                <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-primary">Operational Hub</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-sm transition-all relative group ${
                activeTab === item.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? "text-white" : "group-hover:text-primary transition-colors"}`} />
              {isSidebarOpen && (
                <>
                  <span className="flex-1 text-left text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-sm text-[8px] font-black bg-white text-black">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-4 px-4 py-4 rounded-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit to Site</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-sm text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Disconnect Terminal</span>}
          </button>
        </div>
      </aside>

      {/* Main Command Center */}
      <main className="flex-1 overflow-auto relative z-10">
        {/* Terminal Header */}
        <header className="bg-black/60 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between gap-6 sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-white/30 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h1 className="text-xl font-black uppercase tracking-widest text-white leading-none">{activeTab} Terminal</h1>
              </div>
              <p className="text-[9px] font-mono text-white/30 uppercase mt-1 tracking-widest">Authenticated Session: {user?.email}</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="EXECUTE GLOBAL DIRECTORY SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="w-full h-12 pl-12 pr-4 bg-white/[0.03] border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
              />
            </div>

            {showSearchResults && (searchResults.vehicles.length > 0 || searchResults.users.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-sm shadow-2xl z-50 max-h-96 overflow-y-auto p-2">
                {searchResults.vehicles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] p-3 border-b border-white/5 mb-2">Asset Registry</p>
                    {searchResults.vehicles.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => {
                          setActiveTab("vehicles");
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-sm hover:bg-white/5 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-sm bg-white/5 overflow-hidden flex-shrink-0">
                          {vehicle.image_url ? (
                            <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover grayscale-[0.5]" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-white/10">N/A</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{vehicle.name}</p>
                          <p className="text-[8px] font-mono text-white/30 uppercase">KSh {formatPrice(vehicle.price_per_day)}/Day</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-widest rounded-sm ${
                          vehicle.status === "available" ? "text-green-500 border border-green-500/20" : "text-red-500 border border-red-500/20"
                        }`}>
                          {vehicle.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.users.length > 0 && (
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] p-3 border-b border-white/5 mb-2">Personnel Registry</p>
                    {searchResults.users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setActiveTab("users");
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-sm hover:bg-white/5 transition-all text-left"
                      >
                        <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center text-primary">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{user.full_name || "Personnel"}</p>
                          <p className="text-[8px] font-mono text-white/30 truncate uppercase">{user.phone || "No Comms Code"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/10 rounded-sm">
              <Zap className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Level: {isAdmin ? "Admin Alpha" : "Operator"}</span>
            </div>
          </div>
        </header>

        {/* Tactical Content Area */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes move-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
