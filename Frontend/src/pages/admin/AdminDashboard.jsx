import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import Loading from "../../components/Loading";
import adminService from "../../services/adminService";
import { formatCurrency } from "../../utils/budgetUtils";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [roleUpdatingId, setRoleUpdatingId] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const statsRes = await adminService.getAdminStats();
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }

      const usersRes = await adminService.getAdminUsers();
      if (usersRes.success && Array.isArray(usersRes.users)) {
        setUsers(usersRes.users);
      }

      const tripsRes = await adminService.getAdminTrips();
      if (tripsRes.success && Array.isArray(tripsRes.trips)) {
        setTrips(tripsRes.trips);
      }
    } catch (err) {
      console.error("[Fetch Admin Data Error]:", err);
      const msg = err.response?.data?.message || "Access denied or unable to load admin analytics.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (userItem) => {
    const newRole = userItem.role === "admin" ? "user" : "admin";
    try {
      setRoleUpdatingId(userItem.id);
      const res = await adminService.updateUserRole(userItem.id, newRole);
      if (res.success) {
        setToastMessage(`Updated ${userItem.name}'s role to "${newRole.toUpperCase()}".`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userItem.id ? { ...u, role: newRole } : u))
        );
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("[Toggle Role Error]:", err);
    } finally {
      setRoleUpdatingId(null);
    }
  };

  if (loading) {
    return <Loading message="Loading admin analytics dashboard..." />;
  }

  if (error || !stats) {
    return (
      <div className="gt-card p-5 text-center my-4">
        <div className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mx-auto mb-3" style={{ width: "64px", height: "64px" }}>
          <i className="bi bi-shield-lock fs-2"></i>
        </div>
        <h4 className="font-heading text-navy-deep fw-bold mb-2">{error || "Admin Access Required"}</h4>
        <p className="text-muted small mb-4">You need an administrator account to view system analytics.</p>
        <button onClick={fetchAdminData} className="btn btn-gt-primary px-4">Retry</button>
      </div>
    );
  }

  // Chart Data: Top Cities Bar Chart
  const cityLabels = stats.topCities?.map((c) => c.city?.city_name || "City") || [];
  const cityCounts = stats.topCities?.map((c) => parseInt(c.dataValues?.stopCount || c.stopCount || 0)) || [];

  const cityChartData = {
    labels: cityLabels,
    datasets: [
      {
        label: "Trip Stops Scheduled",
        data: cityCounts,
        backgroundColor: "#0EA5E9",
        borderRadius: 6
      }
    ]
  };

  // Chart Data: Expenses Doughnut Chart
  const expenseCategories = stats.expenseCategoryTotals?.map((e) => e.category) || [];
  const expenseAmounts = stats.expenseCategoryTotals?.map((e) => parseFloat(e.dataValues?.totalAmount || e.totalAmount || 0)) || [];

  const expenseChartData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseAmounts,
        backgroundColor: ["#0EA5E9", "#06D6C9", "#FF8A3D", "#FFD166"],
        borderWidth: 2
      }
    ]
  };

  return (
    <div>
      <PageHeader
        title="Admin Dashboard & System Analytics ⚙️"
        subtitle="Platform-wide metrics, user management, destination trends, and system statistics."
      />

      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Total Users" value={stats.totalUsers} icon="bi-people" badge="Platform" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Trips Created" value={stats.totalTrips} icon="bi-airplane" badge="Global" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Activities Planned" value={stats.totalItineraryItems} icon="bi-ticket-perforated" badge="Scheduled" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Total Expenses Logged" value={formatCurrency(stats.totalExpensesSum, "INR")} icon="bi-wallet2" badge="Financial" gradient />
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-4">
        {/* Top Cities Bar Chart */}
        <div className="col-lg-7">
          <div className="gt-card p-4 p-md-5 h-100">
            <h5 className="font-heading fw-extrabold text-navy-deep mb-3">Popular Travel Destinations</h5>
            <div style={{ height: "260px" }}>
              {cityLabels.length > 0 ? (
                <Bar
                  data={cityChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              ) : (
                <div className="text-center py-5 text-muted small">No city trip data yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Expense Allocation Doughnut Chart */}
        <div className="col-lg-5">
          <div className="gt-card p-4 p-md-5 h-100">
            <h5 className="font-heading fw-extrabold text-navy-deep mb-3">Platform Expense Allocation</h5>
            <div style={{ height: "240px" }} className="d-flex align-items-center justify-content-center">
              {expenseCategories.length > 0 ? (
                <Doughnut
                  data={expenseChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } }
                  }}
                />
              ) : (
                <div className="text-center py-5 text-muted small">No expense records logged yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Users Management Directory Table */}
      <div className="gt-card p-4 p-md-5 mb-4">
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <div>
            <h5 className="font-heading fw-extrabold text-navy-deep mb-0">Platform User Directory</h5>
            <p className="text-muted small mb-0">Manage registered user roles and permissions.</p>
          </div>
          <span className="badge bg-navy-deep text-aqua px-3 py-1.5 rounded-pill fw-bold">
            {users.length} Users Registered
          </span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-light">
              <tr>
                <th className="text-muted small fw-bold">User</th>
                <th className="text-muted small fw-bold">Role</th>
                <th className="text-muted small fw-bold text-center">Trips</th>
                <th className="text-muted small fw-bold text-center">Saved Places</th>
                <th className="text-muted small fw-bold">Joined Date</th>
                <th className="text-muted small fw-bold text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-navy-deep text-aqua fw-bold d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px" }}>
                        {u.name ? u.name.substring(0, 2).toUpperCase() : "U"}
                      </div>
                      <div>
                        <h6 className="mb-0 font-heading fw-bold text-navy-deep">{u.name}</h6>
                        <span className="text-muted small">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "bg-purple text-white" : "bg-light text-navy-deep border"} px-3 py-1 rounded-pill fw-bold`} style={u.role === "admin" ? { backgroundColor: "#8B5CF6" } : {}}>
                      {u.role === "admin" ? "ADMIN 🛡️" : "USER"}
                    </span>
                  </td>
                  <td className="text-center fw-bold text-navy-deep">{u.tripCount}</td>
                  <td className="text-center fw-bold text-navy-deep">{u.savedCount}</td>
                  <td className="text-muted small">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button
                      onClick={() => handleToggleRole(u)}
                      disabled={roleUpdatingId === u.id}
                      className={`btn btn-sm ${u.role === "admin" ? "btn-outline-secondary" : "btn-gt-outline"} px-3 fw-bold`}
                    >
                      {roleUpdatingId === u.id ? "Updating..." : u.role === "admin" ? "Demote to User" : "Make Admin 🛡️"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Trips Stream */}
      <div className="gt-card p-4 p-md-5">
        <h5 className="font-heading fw-extrabold text-navy-deep mb-3">System-Wide Trips Stream</h5>
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-light">
              <tr>
                <th className="text-muted small fw-bold">Trip Name</th>
                <th className="text-muted small fw-bold">Owner</th>
                <th className="text-muted small fw-bold">Dates</th>
                <th className="text-muted small fw-bold text-center">Stops</th>
                <th className="text-muted small fw-bold text-center">Activities</th>
                <th className="text-muted small fw-bold">Visibility</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.id}>
                  <td className="fw-bold text-navy-deep">{t.trip_name || t.name}</td>
                  <td>{t.user?.name || "User"} ({t.user?.email})</td>
                  <td className="text-muted small">{t.start_date} → {t.end_date}</td>
                  <td className="text-center fw-bold">{t.stops ? t.stops.length : 0}</td>
                  <td className="text-center fw-bold">{t.itineraryItems ? t.itineraryItems.length : 0}</td>
                  <td>
                    <span className={`badge ${t.is_public ? "bg-success" : "bg-secondary"} px-2.5 py-1 rounded-pill`}>
                      {t.is_public ? "Public 🌐" : "Private 🔒"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
