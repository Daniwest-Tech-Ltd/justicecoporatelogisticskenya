import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  DollarSign,
  Clock
} from "lucide-react";
import logo from "@/assets/logo.png";

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeRentals: number;
}

const AdminDashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeRentals: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalBookings: 0, // Placeholder - would need bookings table
        totalRevenue: 0, // Placeholder
        activeRentals: 0, // Placeholder
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin", active: true },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Vehicles", icon: Car, path: "/admin/vehicles" },
    { name: "Bookings", icon: Calendar, path: "/admin/bookings" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
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
      title: "Total Bookings", 
      value: stats.totalBookings.toString(), 
      icon: Calendar, 
      color: "bg-green-500/20 text-green-500",
      change: "+8%"
    },
    { 
      title: "Revenue (KES)", 
      value: stats.totalRevenue.toLocaleString(), 
      icon: DollarSign, 
      color: "bg-yellow-500/20 text-yellow-500",
      change: "+23%"
    },
    { 
      title: "Active Rentals", 
      value: stats.activeRentals.toString(), 
      icon: Clock, 
      color: "bg-purple-500/20 text-purple-500",
      change: "+5%"
    },
  ];

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
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? "bg-primary/20 text-primary" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
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
              <h1 className="font-heading text-xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              {isAdmin ? "Admin" : "User"}
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
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
              <Link to="/admin/vehicles" className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center">
                <Car className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Manage Vehicles</p>
              </Link>
              <Link to="/admin/bookings" className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">View Bookings</p>
              </Link>
              <Link to="/admin/users" className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Manage Users</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-bold mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity to display</p>
              <p className="text-sm">Activity will appear here once bookings are made</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
