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
  Clock,
  Package,
  Search,
  ChevronRight
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
    { name: "Orders", icon: Package, id: "orders", badge: stats.pendingOrders },
    { name: "Vehicles", icon: Car, id: "vehicles", badge: stats.totalVehicles },
    { name: "Messages", icon: Mail, id: "messages", badge: stats.unreadMessages },
    { name: "Users", icon: Users, id: "users" },
    { name: "Settings", icon: Settings, id: "settings" },
  ];

  const statCards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers.toString(), 
      icon: Users, 
      color: "bg-blue-500/20 text-blue-500",
      change: "+12%",
      tabId: "users"
    },
    { 
      title: "Total Vehicles", 
      value: stats.totalVehicles.toString(), 
      icon: Car, 
      color: "bg-green-500/20 text-green-500",
      change: "+8%",
      tabId: "vehicles"
    },
    { 
      title: "Total Messages", 
      value: stats.totalMessages.toString(), 
      icon: Mail, 
      color: "bg-yellow-500/20 text-yellow-500",
      change: "+23%",
      tabId: "messages"
    },
    { 
      title: "Pending Orders", 
      value: stats.pendingOrders.toString(), 
      icon: Package, 
      color: "bg-purple-500/20 text-purple-500",
      change: stats.pendingOrders > 0 ? "Action needed" : "All clear",
      tabId: "orders"
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
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
        return <DashboardAnalytics />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE").format(price);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
              {isSidebarOpen && (
                <span className="font-heading font-bold text-sm">Admin Panel</span>
              )}
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? "bg-primary/20 text-primary" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>Back to Site</span>}
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading text-xl font-bold capitalize">{activeTab}</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vehicles, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (searchResults.vehicles.length > 0 || searchResults.users.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {searchResults.vehicles.length > 0 && (
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      VEHICLES
                    </p>
                    {searchResults.vehicles.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => {
                          setActiveTab("vehicles");
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                          {vehicle.image_url ? (
                            <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{vehicle.name}</p>
                          <p className="text-xs text-muted-foreground">KSh {formatPrice(vehicle.price_per_day)}/day</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          vehicle.status === "available" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                        }`}>
                          {vehicle.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.users.length > 0 && (
                  <div className="p-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      USERS
                    </p>
                    {searchResults.users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setActiveTab("users");
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{user.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{user.phone || "No phone"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              {isAdmin ? "Admin" : "User"}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Clickable Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                  <button
                    key={card.title}
                    onClick={() => handleStatCardClick(card.tabId)}
                    className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.color}`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold">{card.value}</h3>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                  </button>
                ))}
              </div>

              {/* Recent Vehicles Preview */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold">Recent Vehicles</h3>
                  <button
                    onClick={() => setActiveTab("vehicles")}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {recentVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setActiveTab("vehicles")}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
                    >
                      <div className="w-full h-20 rounded-lg bg-muted overflow-hidden mb-2">
                        {vehicle.image_url ? (
                          <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{vehicle.name}</p>
                      <p className="text-xs text-muted-foreground">KSh {formatPrice(vehicle.price_per_day)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Users Preview */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold">Recent Users</h3>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {recentUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setActiveTab("users")}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium truncate">{u.full_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.phone || "No phone"}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analytics */}
              <DashboardAnalytics />
            </div>
          )}

          {activeTab !== "dashboard" && renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
