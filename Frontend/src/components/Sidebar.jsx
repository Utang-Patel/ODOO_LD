import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "bi-house" },
    { label: "My Trips", path: "/my-trips", icon: "bi-airplane" },
    { label: "Plan New Trip", path: "/create-trip", icon: "bi-plus-circle" },
    { label: "Explore Cities", path: "/cities", icon: "bi-globe" },
    { label: "Activities", path: "/activities/paris", icon: "bi-ticket-perforated" },
    { label: "Calendar", path: "/calendar/trip_1", icon: "bi-calendar" },
    { label: "Budget", path: "/budget/trip_1", icon: "bi-wallet2" },
    { label: "Shared Trip", path: "/shared/trip_1", icon: "bi-share" },
    { label: "Profile", path: "/profile", icon: "bi-person" },
    { label: "Admin Analytics", path: "/admin", icon: "bi-speedometer2" }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar-desktop d-none d-lg-flex flex-column justify-between p-3 border-end">
      {/* Top Branding Section */}
      <div>
        <div className="px-3 py-3 mb-3 border-bottom border-secondary border-opacity-25">
          <span className="text-uppercase text-white-50 fs-7 fw-bold tracking-wider">
            Main Menu
          </span>
        </div>

        {/* Links Navigation */}
        <nav className="nav flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 transition-all ${
                  isActive
                    ? "bg-ocean-gradient text-white fw-bold shadow-sm"
                    : "text-white-50 hover-text-white"
                }`
              }
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span className="fs-6">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Quick Promo & Logout */}
      <div className="mt-auto pt-4 border-top border-secondary border-opacity-25">
        <div className="bg-dark bg-opacity-50 p-3 rounded-4 mb-3 border border-secondary border-opacity-25 text-center">
          <i className="bi bi-compass text-aqua fs-3 mb-2 d-block"></i>
          <h6 className="text-white fw-bold mb-1 fs-7">GlobeTrotter Pro</h6>
          <p className="text-white-50 small mb-0">Multi-city smart route builder</p>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2"
        >
          <i className="bi bi-box-arrow-right fs-5"></i>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
