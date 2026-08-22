import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Globe3D from "../../components/Globe3D";
import TripCard from "../../components/TripCard";
import DestinationCard from "../../components/DestinationCard";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import tripService from "../../services/tripService";
import { calculateTripDays } from "../../utils/dateUtils";
import {
  RECOMMENDED_DESTINATIONS,
  BUDGET_HIGHLIGHTS,
  QUICK_ACTIONS
} from "../../data/dashboardData";

const Dashboard = () => {
  const { user } = useAuth();
  const [realTrips, setRealTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        setLoadingTrips(true);
        const res = await tripService.getTrips();
        if (res.success && Array.isArray(res.trips)) {
          setRealTrips(res.trips);
        } else {
          setRealTrips([]);
        }
      } catch (err) {
        console.error("[Dashboard Trips Fetch Error]:", err);
        setRealTrips([]);
      } finally {
        setLoadingTrips(false);
      }
    };

    fetchUserTrips();
  }, []);

  // Calculate real stats
  const totalTripsCount = realTrips.length;
  const totalTravelDays = realTrips.reduce((acc, t) => {
    return acc + calculateTripDays(t.start_date || t.startDate, t.end_date || t.endDate);
  }, 0);

  // Dynamic greeting based on current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Framer Motion Stagger Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="d-flex flex-column gap-5"
    >
      {/* 1. HERO / WELCOME SECTION */}
      <motion.div variants={itemVariants}>
        <div className="gt-card bg-navy-deep text-white p-4 p-md-5 rounded-4 position-relative overflow-hidden shadow-lg border-0">
          <div
            className="position-absolute top-0 start-0 rounded-circle bg-ocean-gradient opacity-20"
            style={{ width: "400px", height: "400px", filter: "blur(100px)", pointerEvents: "none" }}
          ></div>
          <div
            className="position-absolute bottom-0 end-0 rounded-circle bg-sunset-gradient opacity-15"
            style={{ width: "350px", height: "350px", filter: "blur(90px)", pointerEvents: "none" }}
          ></div>

          <div className="row align-items-center position-relative z-1">
            <div className="col-lg-7 mb-4 mb-lg-0">
              <span className="badge bg-white bg-opacity-10 text-aqua px-3 py-2 rounded-pill fw-semibold mb-3 border border-white border-opacity-20 d-inline-flex align-items-center gap-2">
                <span className="pulse-dot bg-aqua rounded-circle" style={{ width: "8px", height: "8px" }}></span>
                {getGreeting()}, {user?.name || "Traveler"} 👋
              </span>

              <h1 className="font-heading display-5 fw-extrabold text-white mb-3">
                Your next adventure <br />
                <span className="text-ocean-gradient">starts here. ✈️</span>
              </h1>

              <p className="text-white-50 lead fs-6 mb-4 max-w-lg">
                Plan, organize and experience your perfect journey with multi-city visual routes and smart travel budgets.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/create-trip" className="btn btn-gt-sunset px-4 py-2.5 rounded-3 font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-plus-circle-fill fs-5"></i>
                  <span>+ Plan New Trip</span>
                </Link>
                <Link to="/cities" className="btn btn-outline-light px-4 py-2.5 rounded-3 font-heading fw-semibold d-flex align-items-center gap-2">
                  <i className="bi bi-compass fs-5"></i>
                  <span>Explore Destinations</span>
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center mt-3 mt-lg-0">
              <div className="glass-card p-2 rounded-4 border border-white border-opacity-20 shadow-lg bg-white bg-opacity-10">
                <Globe3D />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. QUICK ACTIONS SECTION */}
      <motion.div variants={itemVariants}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-extrabold text-navy-deep mb-1">Plan Your Journey</h4>
            <p className="text-muted small mb-0">Quick shortcuts to kickstart your travel activities.</p>
          </div>
        </div>

        <div className="row g-3">
          {QUICK_ACTIONS.map((action) => (
            <div key={action.id} className="col-6 col-md-3">
              <Link to={action.path} className="text-decoration-none">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`gt-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between ${
                    action.gradient === "bg-ocean-gradient"
                      ? "bg-ocean-gradient text-white"
                      : action.gradient === "bg-sunset-gradient"
                      ? "bg-sunset-gradient text-navy-deep"
                      : "bg-white text-navy-deep"
                  }`}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className={`d-flex align-items-center justify-content-center rounded-3 p-2 ${
                        action.gradient.includes("gradient")
                          ? "bg-white bg-opacity-20 text-white"
                          : "bg-light text-ocean-blue"
                      }`}
                      style={{ width: "44px", height: "44px" }}
                    >
                      <i className={`bi ${action.icon} fs-4`}></i>
                    </div>
                    <i className="bi bi-arrow-up-right fs-5 opacity-75"></i>
                  </div>
                  <div>
                    <h6 className="font-heading fw-bold mb-1">{action.title}</h6>
                    <p className="small mb-0 opacity-75 line-clamp-1">{action.description}</p>
                  </div>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. UPCOMING / RECENT TRIPS (REAL USER DATA FROM MYSQL) */}
      <motion.div variants={itemVariants}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-extrabold text-navy-deep mb-1">Your Trips</h4>
            <p className="text-muted small mb-0">Recent and upcoming multi-city itineraries.</p>
          </div>
          <Link to="/my-trips" className="btn btn-gt-outline btn-sm fw-semibold">
            View All Trips <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {loadingTrips ? (
          <Loading message="Fetching your real trips..." />
        ) : realTrips.length > 0 ? (
          <div className="row g-4">
            {realTrips.slice(0, 3).map((trip) => (
              <div key={trip.id} className="col-md-6 col-lg-4">
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No trips planned yet ✈️"
            description="Start planning your next adventure today."
            actionLabel="Plan New Trip"
            actionPath="/create-trip"
          />
        )}
      </motion.div>

      {/* 4. RECOMMENDED DESTINATIONS */}
      <motion.div variants={itemVariants}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-extrabold text-navy-deep mb-1">Explore Your Next Destination</h4>
            <p className="text-muted small mb-0">Handpicked iconic cities trending worldwide.</p>
          </div>
          <Link to="/cities" className="btn btn-gt-outline btn-sm fw-semibold">
            Explore All <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-4">
          {RECOMMENDED_DESTINATIONS.map((city) => (
            <div key={city.id} className="col-md-6 col-lg-4">
              <DestinationCard city={city} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. BUDGET HIGHLIGHTS */}
      <motion.div variants={itemVariants}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-extrabold text-navy-deep mb-1">Trip Budget Highlights</h4>
            <p className="text-muted small mb-0">Financial allocation summary for {BUDGET_HIGHLIGHTS.activeTripName}.</p>
          </div>
          <Link to="/budget/trip_1" className="btn btn-gt-outline btn-sm fw-semibold">
            Full Budget Breakdown <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="gt-card p-4 p-md-5">
          <div className="row align-items-center mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <span className="badge bg-light text-ocean-blue border fw-bold px-3 py-1 mb-2">
                Active Itinerary: {BUDGET_HIGHLIGHTS.activeTripName}
              </span>
              <h2 className="font-heading display-6 fw-extrabold text-navy-deep mb-0">
                ₹{BUDGET_HIGHLIGHTS.totalEstimated.toLocaleString()}
              </h2>
              <span className="text-muted fs-7">Estimated Total Budget</span>
            </div>

            <div className="col-md-6 text-md-end">
              <div className="d-inline-flex gap-4 p-3 bg-light rounded-4 border">
                <div>
                  <span className="text-muted fs-7 d-block">Estimated Spent</span>
                  <span className="fw-extrabold text-navy-deep fs-5">₹{BUDGET_HIGHLIGHTS.spentAmount.toLocaleString()}</span>
                </div>
                <div className="border-start ps-4">
                  <span className="text-muted fs-7 d-block">Remaining</span>
                  <span className="fw-extrabold text-success fs-5">₹{BUDGET_HIGHLIGHTS.remainingAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between text-muted fs-7 mb-2 fw-semibold">
              <span>Budget Consumption</span>
              <span className="text-ocean-blue fw-bold">{BUDGET_HIGHLIGHTS.progressPercentage}% Allocated</span>
            </div>
            <div className="progress" style={{ height: "12px", borderRadius: "10px" }}>
              <div
                className="progress-bar bg-ocean-gradient"
                role="progressbar"
                style={{ width: `${BUDGET_HIGHLIGHTS.progressPercentage}%` }}
                aria-valuenow={BUDGET_HIGHLIGHTS.progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <div className="row g-3 pt-3 border-top">
            {BUDGET_HIGHLIGHTS.categories.map((cat, idx) => (
              <div key={idx} className="col-6 col-sm-3">
                <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                  <div
                    className="p-2 rounded-2 text-white d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: cat.color, width: "38px", height: "38px" }}
                  >
                    <i className={`bi ${cat.icon} fs-5`}></i>
                  </div>
                  <div>
                    <span className="text-muted fs-7 d-block">{cat.name}</span>
                    <span className="fw-bold text-navy-deep fs-6">₹{cat.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 6. SUMMARY STATISTIC ROW (REAL TRIP STATS) */}
      <motion.div variants={itemVariants}>
        <div className="row g-3">
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Trips Planned" value={totalTripsCount} icon="bi-airplane" badge="Real Data" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Destinations" value={8} icon="bi-building" badge="Global" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Travel Days" value={totalTravelDays} icon="bi-calendar3" badge="Scheduled" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Estimated Budget" value="₹85,500" icon="bi-wallet2" badge="INR (₹)" gradient />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
