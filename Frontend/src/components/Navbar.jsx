import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (str) => {
    if (!str) return "GT";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <nav
      className="navbar navbar-expand sticky-top px-4 py-3 border-bottom"
      style={{
        backgroundColor: "rgba(11, 16, 38, 0.85)",
        borderColor: "rgba(124, 58, 237, 0.2) !important",
        backdropFilter: "blur(16px)",
        zIndex: 1010
      }}
    >
      <div className="container-fluid p-0">
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="btn btn-gt-outline d-lg-none me-3 px-2.5 py-1"
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        {/* Quick Search Bar */}
        <div className="d-none d-md-flex align-items-center me-auto position-relative" style={{ width: "340px" }}>
          <i className="bi bi-search position-absolute text-muted ms-3 top-50 translate-middle-y"></i>
          <input
            type="text"
            className="form-control rounded-pill ps-5 bg-dark border-0 shadow-none text-white small"
            placeholder="Search trips, cities, activities..."
            onClick={() => navigate("/cities")}
            readOnly
            style={{ cursor: "pointer", backgroundColor: "rgba(17, 25, 54, 0.8)" }}
          />
        </div>

        {/* Navigation Actions */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Quick Create Trip Button (For Regular Users) */}
          {user?.role !== "admin" && (
            <Link to="/create-trip" className="btn btn-gt-primary btn-sm d-none d-sm-flex align-items-center gap-2 px-3.5 py-2 fw-bold font-heading">
              <i className="bi bi-plus-circle-fill"></i>
              <span>Plan Trip</span>
            </Link>
          )}

          {/* Quick Explore Button (For Regular Users) */}
          {user?.role !== "admin" && (
            <Link to="/cities" className="btn btn-gt-outline btn-sm d-none d-md-flex align-items-center gap-2 px-3.5 py-2 fw-semibold font-heading">
              <i className="bi bi-compass me-1"></i>
              <span>Explore</span>
            </Link>
          )}

          {/* User Profile Avatar Icon Dropdown Button (Icon Only - Click to Open Dropdown) */}
          <div className="dropdown">
            <button
              className="btn p-0 border-0 d-flex align-items-center text-decoration-none shadow-none bg-transparent"
              type="button"
              id="userMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title={user?.name || "User Profile Menu"}
            >
              <div
                className="rounded-circle bg-saas-gradient text-white font-heading fw-extrabold fs-6 d-flex align-items-center justify-content-center border border-2 border-white border-opacity-25 shadow-sm transition-all hover-scale"
                style={{ width: "42px", height: "42px", cursor: "pointer" }}
              >
                {getInitials(user?.name)}
              </div>
            </button>

            <ul
              className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-2"
              aria-labelledby="userMenuButton"
              style={{ backgroundColor: "#0b1026", width: "230px" }}
            >
              <li>
                <div className="px-3 py-2 border-bottom border-white border-opacity-10 mb-1">
                  <p className="fw-bold mb-0 text-white font-heading">{user?.name || "User"}</p>
                  <p className="small text-white-50 mb-0 text-truncate font-heading">{user?.email}</p>
                  {user?.role === "admin" && (
                    <span className="badge bg-saas-gradient mt-1 px-2.5 py-1 rounded-pill fs-8 font-heading fw-bold">
                      ADMIN 🛡️
                    </span>
                  )}
                </div>
              </li>

              {/* Admin Menu Options */}
              {user?.role === "admin" ? (
                <>
                  <li>
                    <Link to="/admin" className="dropdown-item rounded-3 py-2 text-white mt-1">
                      <i className="bi bi-shield-lock me-2 text-warning"></i> Admin Panel
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="dropdown-item rounded-3 py-2 text-white">
                      <i className="bi bi-person me-2 text-saas-gradient"></i> Profile Settings
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/profile" className="dropdown-item rounded-3 py-2 text-white mt-1">
                      <i className="bi bi-person me-2 text-saas-gradient"></i> Profile Settings
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-trips" className="dropdown-item rounded-3 py-2 text-white">
                      <i className="bi bi-airplane me-2 text-saas-gradient"></i> My Trips
                    </Link>
                  </li>
                </>
              )}

              <li><hr className="dropdown-divider border-white border-opacity-10 my-1" /></li>
              <li>
                <button onClick={handleLogout} className="dropdown-item rounded-3 py-2 text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i> Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
