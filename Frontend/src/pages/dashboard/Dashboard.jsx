import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DUMMY_TRIPS, DUMMY_CITIES, DUMMY_STATS } from "../../data/dummyData";
import TripCard from "../../components/TripCard";
import DestinationCard from "../../components/DestinationCard";
import StatCard from "../../components/StatCard";

const Dashboard = () => {
  const { user } = useAuth();
  const upcomingTrips = DUMMY_TRIPS.slice(0, 2);
  const recommendedCities = DUMMY_CITIES.slice(0, 3);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Tropical Aurora Hero Banner with 3D Globe Container */}
      <div className="gt-card bg-navy-deep text-white p-4 p-md-5 rounded-4 position-relative overflow-hidden shadow-lg border-0">
        <div className="row align-items-center position-relative z-1">
          <div className="col-lg-7 mb-4 mb-lg-0">
            <span className="badge bg-white bg-opacity-10 text-aqua px-3 py-2 rounded-pill fw-semibold mb-3 border border-white border-opacity-20">
              ✈️ Welcome Back, {user?.name || "Traveler"}!
            </span>
            <h1 className="font-heading display-5 fw-extrabold text-white mb-3">
              Your Next Adventure <br />
              <span className="text-ocean-gradient">Starts Here.</span>
            </h1>
            <p className="text-white-50 lead fs-6 mb-4 max-w-lg">
              Plan multi-city itineraries, manage travel budgets, map visual routes, and explore popular global destinations seamlessly.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/create-trip" className="btn btn-gt-sunset px-4 py-2.5 rounded-3 font-heading fw-bold">
                <i className="bi bi-plus-circle-fill me-2"></i> Plan New Trip
              </Link>
              <Link to="/cities" className="btn btn-outline-light px-4 py-2.5 rounded-3 font-heading fw-semibold">
                <i className="bi bi-globe me-2"></i> Explore Destinations
              </Link>
            </div>
          </div>

          {/* Right 3D Globe Canvas Placeholder Container */}
          <div className="col-lg-5 text-center">
            <div
              className="glass-card p-4 d-flex flex-column align-items-center justify-content-center border-white border-opacity-20 rounded-4"
              style={{ minHeight: "260px", background: "rgba(255, 255, 255, 0.05)" }}
            >
              <div
                className="d-flex align-items-center justify-content-center bg-ocean-gradient text-white rounded-circle shadow-lg mb-3"
                style={{ width: "100px", height: "100px", animation: "pulse 3s infinite" }}
              >
                <i className="bi bi-globe fs-1"></i>
              </div>
              <h5 className="font-heading text-white fw-bold mb-1">Interactive 3D Globe</h5>
              <p className="text-white-50 small mb-0">Three.js / React Three Fiber Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="row g-3">
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Total Planned Trips" value={DUMMY_STATS.totalTrips} icon="bi-airplane" badge="Active" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Countries Visited" value={DUMMY_STATS.countriesVisited} icon="bi-globe-americas" badge="Global" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Cities Explored" value={DUMMY_STATS.citiesExplored} icon="bi-building" badge="Destinations" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard label="Budget Managed" value={DUMMY_STATS.totalSavedBudget} icon="bi-wallet2" badge="INR (₹)" gradient />
        </div>
      </div>

      {/* Upcoming Trips Section */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-bold text-navy-deep mb-1">Upcoming Journeys</h4>
            <p className="text-muted small mb-0">Your scheduled multi-city itineraries.</p>
          </div>
          <Link to="/my-trips" className="btn btn-gt-outline btn-sm">
            View All Trips <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-4">
          {upcomingTrips.map((trip) => (
            <div key={trip.id} className="col-md-6">
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Destinations */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-bold text-navy-deep mb-1">Recommended Destinations</h4>
            <p className="text-muted small mb-0">Popular global cities trending among travelers.</p>
          </div>
          <Link to="/cities" className="btn btn-gt-outline btn-sm">
            Explore All <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-4">
          {recommendedCities.map((city) => (
            <div key={city.id} className="col-md-4">
              <DestinationCard city={city} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
