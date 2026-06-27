// src/pages/Admin.jsx

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  Search,
  Trash2,
  Eye,
  Mail,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import API from "../services/api";

const Admin = () => {
  const [stats, setStats] = useState({
    users: 0,
    suppliers: 0,
    buyers: 0,
    listings: 0,
    requests: 0,
  });

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("user");
  const adminUser = storedUser ? JSON.parse(storedUser) : null;

  const adminName =
    adminUser?.ownerName ||
    adminUser?.name ||
    adminUser?.businessName ||
    "Admin";

  const initials =
    adminName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const statsRes = await API.get("/admin/stats");
      const usersRes = await API.get("/admin/users");

      setStats({
        users: statsRes.data.users || 0,
        suppliers: statsRes.data.suppliers || 0,
        buyers: statsRes.data.buyers || 0,
        listings: statsRes.data.listings || 0,
        requests: statsRes.data.requests || 0,
      });

      setUsers(usersRes.data || []);
    } catch (err) {
      console.log("Admin data fetch error:", err);
      setError("Failed to load real admin data from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId, email) => {
    if (email === adminUser?.email) {
      alert("You cannot delete your own admin account.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      await fetchAdminData();
    } catch (err) {
      console.log("Delete user error:", err);
      alert("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const text = `${user.businessName || ""} ${user.ownerName || ""} ${
      user.email || ""
    } ${user.role || ""}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ReuseHub Control Panel
            </span>

            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:text-[#4A7538] disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            

            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="h-11 w-11 rounded-full bg-[#4A7538] text-white flex items-center justify-center font-extrabold text-sm">
                {initials}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 truncate">
                  {adminName}
                </h3>

                <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {adminUser?.email || "admin@reusehub.com"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <StatCard icon={Users} title="Total Users" value={stats.users} />
          <StatCard icon={Users} title="Suppliers" value={stats.suppliers} />
          <StatCard icon={Users} title="Buyers" value={stats.buyers} />
          <StatCard icon={Package} title="Listings" value={stats.listings} />
          <StatCard
            icon={ClipboardList}
            title="Requests"
            value={stats.requests}
          />
        </div>

        {/* Main Grid */}
  <div className="flex justify-center">
  {/* Users Table */}
  <div className="w-full max-w-6xl bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  User Management
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Real buyers, suppliers, and admins from MongoDB.
                </p>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#4A7538] focus:ring-1 focus:ring-[#4A7538]/20"
                />
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500 font-semibold">
                Loading users from backend...
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-3 font-bold">Business</th>
                      <th className="py-3 font-bold">Owner</th>
                      <th className="py-3 font-bold">Email</th>
                      <th className="py-3 font-bold">Role</th>
                      <th className="py-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-6 text-center text-slate-400 font-semibold"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-slate-100"
                        >
                          <td className="py-4 font-bold text-slate-800">
                            {user.businessName || "-"}
                          </td>

                          <td className="py-4 text-slate-600">
                            {user.ownerName || user.name || "-"}
                          </td>

                          <td className="py-4 text-slate-500">
                            {user.email || "-"}
                          </td>

                          <td className="py-4">
                            <span className="px-2.5 py-1 rounded-full bg-[#EDF4EA] text-[#4A7538] text-xs font-bold capitalize">
                              {user.accountType || "-"}
                            </span>
                          </td>

                          <td className="py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-[#4A7538]"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteUser(user._id, user.email)
                                }
                                disabled={user.email === adminUser?.email}
                                className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    User Details
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold">
                    MongoDB user profile information
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <Detail label="Business" value={selectedUser.businessName} />
                <Detail
                  label="Owner"
                  value={selectedUser.ownerName || selectedUser.name}
                />
                <Detail label="Email" value={selectedUser.email} />
                <Detail label="Phone" value={selectedUser.phone} />
                <Detail label="Role" value={selectedUser.role} />
                <Detail
                  label="Category"
                  value={selectedUser.businessCategory}
                />
                <Detail label="Location" value={selectedUser.location} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-[#EDF4EA] text-[#4A7538] flex items-center justify-center mb-4">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
        {value || 0}
      </h3>
    </div>
  );
};

const OverviewItem = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className="text-sm font-extrabold text-slate-900">
        {value || 0}
      </span>
    </div>
  );
};

const Detail = ({ label, value }) => {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
      <span className="font-bold text-slate-500">{label}</span>
      <span className="text-slate-800 text-right">{value || "-"}</span>
    </div>
  );
};

export default Admin;