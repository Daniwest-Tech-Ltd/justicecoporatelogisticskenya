import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Phone, Calendar, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
  role?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "user",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">View and manage registered users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="glass-button flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium mb-2">No users found</p>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search" : "Users will appear here once they register"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name || "No name"}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {user.phone || "Not provided"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-primary/20 text-primary"
                            : user.role === "moderator"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{users.length}</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-green-500">
            {users.filter((u) => u.role === "admin").length}
          </p>
          <p className="text-sm text-muted-foreground">Admins</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">
            {users.filter((u) => u.role === "user").length}
          </p>
          <p className="text-sm text-muted-foreground">Regular Users</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
