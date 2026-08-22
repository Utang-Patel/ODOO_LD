import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoPng from "../assets/logo.png";
import tripService from "../services/tripService";

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTripId, setActiveTripId] = useState("");

  useEffect(() => {
    const fetchFirstTrip = async () => {
      try {
        const res = await tripService.getTrips();
        if (res.success && Array.isArray(res.trips) && res.trips.length > 0) {
          setActiveTripId(res.trips[0].id);
        }
      } catch (err) {
        console.error("[Sidebar Fetch Trips Error]:", err);
      }
    };
    fetchFirstTrip();
  }, []);

  const tripIdParam = activeTripId || "trip_1";

  // Navigation Items: Display ONLY Admin Analytics and Profile for Admin users
  const navItems = user?.role === "admin"
    ? [
        { label: "Admin Analytics", path: "/admin", icon: "bi-speedometer2" },
        { label: "Profile", path: "/profile", icon: "bi-person" }
      ]
    : [
        { label: "Dashboard", path: "/dashboard", icon: "bi-house" },
        { label: "My Trips", path: "/my-trips", icon: "bi-airplane" },
        { label: "Plan New Trip", path: "/create-trip", icon: "bi-plus-circle" },
        { label: "Explore Cities", path: "/cities", icon: "bi-globe" },
        { label: "Activities", path: "/activities/1", icon: "bi-ticket-perforated" },
        { label: "Calendar", path: `/calendar/${tripIdParam}`, icon: "bi-calendar" },
        { label: "Budget", path: `/budget/${tripIdParam}`, icon: "bi-wallet2" },
        { label: "Shared Trip", path: `/shared/${tripIdParam}`, icon: "bi-share" },
        { label: "Profile", path: "/profile", icon: "bi-person" }
      ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`d-none d-lg-flex flex-column justify-content-between p-3 border-end position-fixed top-0 start-0 ${
        isCollapsed ? "gt-sidebar-collapsed" : "gt-sidebar-expanded"
      }`}
      style={{
        backgroundColor: "rgba(11, 16, 38, 0.95)",
        borderColor: "rgba(124, 58, 237, 0.2) !important",
        backdropFilter: "blur(16px)",
        zIndex: 1030,
        height: "100vh",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* Top Branding Logo Header (Click Logo to Toggle Collapse) */}
      <div>
        <div className={`d-flex align-items-center ${isCollapsed ? "justify-content-center px-0" : "px-2"} py-3 mb-3 border-bottom border-white border-opacity-10 w-100`}>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="btn p-0 border-0 d-flex align-items-center gap-3 text-decoration-none shadow-none bg-transparent"
            style={{ cursor: "pointer" }}
            title={isCollapsed ? "Click logo to expand sidebar" : "Click logo to collapse sidebar"}
          >
            <div
              className="rounded-3 p-1 d-flex align-items-center justify-content-center shadow-sm"
              style={{ backgroundColor: "#FFFFFF", width: "40px", height: "40px", flexShrink: 0 }}
            >
              <img
                src={logoPng}
                alt="GlobeTrotter Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            {!isCollapsed && (
              <span className="font-heading fs-4 fw-extrabold text-white text-nowrap ms-1">
                Globe<span className="text-saas-gradient">Trotter</span>
              </span>
            )}
          </button>
        </div>

        {/* Links Navigation */}
        <nav className="nav flex-column gap-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              title={isCollapsed ? item.label : ""}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${
                  isCollapsed ? "justify-content-center px-0" : "gap-3 px-3"
                } py-2.5 rounded-3 transition-all ${
                  isActive
                    ? "bg-saas-gradient text-white fw-bold shadow-lg"
                    : "text-white-50 hover-text-white"
                }`
              }
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              {!isCollapsed && <span className="fs-6 font-heading text-nowrap ms-1">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Logout Button Only */}
      <div className="mt-auto pt-2 border-top border-white border-opacity-10">
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Log Out" : ""}
          className={`btn btn-outline-danger w-100 d-flex align-items-center ${
            isCollapsed ? "justify-content-center px-0" : "justify-content-center gap-2"
          } rounded-3 py-2 fw-semibold font-heading`}
        >
          <i className="bi bi-box-arrow-right fs-5"></i>
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
