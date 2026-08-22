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

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom shadow-sm px-3 py-2">
      <div className="container-fluid">
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="btn btn-gt-outline d-lg-none me-2 px-2 py-1"
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <i className="bi bi-list fs-4"></i>
        </button>


        {/* Quick Search Bar */}
        <div className="d-none d-md-flex align-items-center me-auto position-relative" style={{ width: "320px" }}>
          <i className="bi bi-search position-absolute text-muted ms-3"></i>
          <input
            type="text"
            className="form-control rounded-pill ps-5 bg-light border-0 shadow-none text-muted"
            placeholder="Search trips, cities, activities..."
            onClick={() => navigate("/cities")}
            readOnly
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Navigation Actions */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Quick Create Trip Button */}
          <Link to="/create-trip" className="btn btn-gt-primary btn-sm d-none d-sm-flex align-items-center gap-2">
            <i className="bi bi-plus-circle-fill"></i>
            <span>Plan Trip</span>
          </Link>

          {/* Quick Explore Button */}
          <Link to="/cities" className="btn btn-gt-outline btn-sm d-none d-md-flex align-items-center gap-1">
            <i className="bi bi-globe"></i>
            <span>Explore</span>
          </Link>

          {/* Notifications Icon */}
          <div className="position-relative">
            <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
              <i className="bi bi-bell fs-5 text-secondary"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-sunset-gradient border border-light rounded-circle">
                <span className="visually-hidden">New notifications</span>
              </span>
            </button>
          </div>

          {/* User Profile Dropdown */}
          <div className="dropdown">
            <button
              className="btn p-0 border-0 d-flex align-items-center gap-2 dropdown-toggle text-decoration-none"
              type="button"
              id="userMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={user?.name || "User Avatar"}
                className="rounded-circle border border-2 border-primary"
                style={{ width: "38px", height: "38px", objectFit: "cover" }}
              />
              <span className="d-none d-lg-inline text-navy-deep fw-semibold small ms-1">
                {user?.name || "Traveler"}
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-2" aria-labelledby="userMenuButton">
              <li>
                <div className="px-3 py-2 border-bottom">
                  <p className="fw-bold mb-0 text-navy-deep">{user?.name || "Traveler"}</p>
                  <p className="small text-muted mb-0">{user?.email || "user@globetrotter.io"}</p>
                </div>
              </li>
              <li>
                <Link to="/profile" className="dropdown-menu-item dropdown-item rounded-2 py-2 mt-1">
                  <i className="bi bi-person me-2 text-ocean-blue"></i> My Profile
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="dropdown-menu-item dropdown-item rounded-2 py-2">
                  <i className="bi bi-airplane me-2 text-ocean-blue"></i> My Trips
                </Link>
              </li>
              <li>
                <Link to="/admin" className="dropdown-menu-item dropdown-item rounded-2 py-2">
                  <i className="bi bi-speedometer2 me-2 text-sunset-orange"></i> Admin Analytics
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button onClick={handleLogout} className="dropdown-item rounded-2 py-2 text-danger">
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
