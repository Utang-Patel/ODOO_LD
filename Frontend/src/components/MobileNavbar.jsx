import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MobileNavbar = ({ show, onHide }) => {
  const { user, logout } = useAuth();
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
    onHide();
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop */}
      {show && (
        <div
          className="offcanvas-backdrop fade show d-lg-none"
          onClick={onHide}
          style={{ zIndex: 1040 }}
        ></div>
      )}

      {/* Offcanvas Drawer */}
      <div
        className={`offcanvas offcanvas-start bg-navy-deep text-white d-lg-none ${
          show ? "show" : ""
        }`}
        tabIndex="-1"
        style={{
          visibility: show ? "visible" : "hidden",
          zIndex: 1050,
          transition: "transform 0.3s ease-in-out"
        }}
      >
        <div className="offcanvas-header border-bottom border-secondary border-opacity-25 px-4 py-3">
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center bg-ocean-gradient text-white rounded-3 p-2">
              <i className="bi bi-airplane-engines fs-5"></i>
            </div>
            <h5 className="offcanvas-title font-heading fw-bold text-white mb-0">GlobeTrotter</h5>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onHide}
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column justify-content-between p-4">
          <div className="nav flex-column gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onHide}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 ${
                    isActive
                      ? "bg-ocean-gradient text-white fw-bold"
                      : "text-white-50"
                  }`
                }
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-top border-secondary border-opacity-25">
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2"
            >
              <i className="bi bi-box-arrow-right fs-5"></i>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
