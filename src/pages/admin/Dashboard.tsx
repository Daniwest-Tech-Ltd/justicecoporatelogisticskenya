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
  Package
} from "lucide-react";
import logo from "@/assets/logo.png";
import VehicleManagement from "./VehicleManagement";
import MessageInbox from "./MessageInbox";
import OrderManagement from "./OrderManagement";
import UserManagement from "./UserManagement";
import AdminSettings from "./AdminSettings";

interface DashboardStats {
  totalUsers: number;
  totalVehicles: number;
  totalMessages: number;
  unreadMessages: number;
  pendingOrders: number;
}

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVehicles: 0,
    totalMessages: 0,
    unreadMessages: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
      change: "+12%"
    },
    { 
      title: "Total Vehicles", 
      value: stats.totalVehicles.toString(), 
      icon: Car, 
      color: "bg-green-500/20 text-green-500",
      change: "+8%"
    },
    { 
      title: "Total Messages", 
      value: stats.totalMessages.toString(), 
      icon: Mail, 
      color: "bg-yellow-500/20 text-yellow-500",
      change: "+23%"
    },
    { 
      title: "Unread Messages", 
      value: stats.unreadMessages.toString(), 
      icon: Mail, 
      color: "bg-purple-500/20 text-purple-500",
      change: stats.unreadMessages > 0 ? "Action needed" : "All read"
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
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat) => (
                <div key={stat.title} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="flex items-center gap-1 text-green-500 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h2 className="font-heading text-lg font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab("vehicles")}
                  className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
                >
                  <Car className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Manage Vehicles</p>
                </button>
                <button 
                  onClick={() => setActiveTab("messages")}
                  className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center relative"
                >
                  <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">View Messages</p>
                  {stats.unreadMessages > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      {stats.unreadMessages}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("users")}
                  className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
                >
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Manage Users</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h2 className="font-heading text-lg font-bold mb-4">Recent Activity</h2>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity to display</p>
                <p className="text-sm">Activity will appear here once bookings are made</p>
              </div>
            </div>
          </div>
        );
    }
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
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              {isAdmin ? "Admin" : "User"}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
