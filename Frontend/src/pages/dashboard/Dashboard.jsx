import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import TripCard from "../../components/TripCard";
import DestinationCard from "../../components/DestinationCard";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/Loading";
import tripService from "../../services/tripService";
import cityService from "../../services/cityService";
import savedDestinationService from "../../services/savedDestinationService";
import expenseService from "../../services/expenseService";
import { formatCurrency, calculateBudgetTotals } from "../../utils/budgetUtils";

const Dashboard = () => {
  const { user } = useAuth();
  const [realTrips, setRealTrips] = useState([]);
  const [realCities, setRealCities] = useState([]);
  const [savedCityIds, setSavedCityIds] = useState([]);
  const [activeTripExpenses, setActiveTripExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch real trips from MySQL
        const tripsRes = await tripService.getTrips();
        let tripsList = [];
        if (tripsRes.success && Array.isArray(tripsRes.trips)) {
          tripsList = tripsRes.trips;
          setRealTrips(tripsList);
        }

        // Fetch real cities from MySQL
        const citiesRes = await cityService.getCities({ limit: 3 });
        if (citiesRes.success && Array.isArray(citiesRes.cities)) {
          setRealCities(citiesRes.cities.slice(0, 3));
        }

        // Fetch saved cities
        const savedRes = await savedDestinationService.getSavedDestinations();
        if (savedRes.success && Array.isArray(savedRes.savedIds)) {
          setSavedCityIds(savedRes.savedIds);
        }

        // Fetch real expenses for active trip if exists
        if (tripsList.length > 0) {
          const firstTripId = tripsList[0].id;
          const expRes = await expenseService.getExpenses(firstTripId);
          if (expRes.success && Array.isArray(expRes.expenses)) {
            setActiveTripExpenses(expRes.expenses);
          }
        }
      } catch (err) {
        console.error("[Dashboard Fetch Error]:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate real metrics from database
  const totalTripsCount = realTrips.length;

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingEventsCount = realTrips.filter((t) => (t.start_date || t.startDate) >= todayStr).length;

  // Calculate total itinerary activities count across all trips
  const totalActivitiesCount = realTrips.reduce((acc, t) => {
    return acc + (t.itineraryItems ? t.itineraryItems.length : 0);
  }, 0);

  // Calculate unique cities/stops visited
  const totalCitiesCount = savedCityIds.length > 0 ? savedCityIds.length : realCities.length;

  // Active Trip Budget Calculation
  const activeTrip = realTrips.length > 0 ? realTrips[0] : null;
  const activeTripName = activeTrip ? (activeTrip.trip_name || activeTrip.name) : "Sample Journey";
  const activeTripBudget = activeTrip && activeTrip.budget_limit ? parseFloat(activeTrip.budget_limit) : 50000;
  const currency = activeTrip ? activeTrip.currency || "INR" : "INR";

  const totals = calculateBudgetTotals(activeTripExpenses, activeTrip?.itineraryItems || []);
  const totalSpent = totals.totalCost;
  const remainingBudget = Math.max(0, activeTripBudget - totalSpent);
  const progressPercentage = activeTripBudget > 0 ? Math.min(100, Math.round((totalSpent / activeTripBudget) * 100)) : 0;

  const firstTripId = activeTrip ? activeTrip.id : null;

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

  if (loading) {
    return <Loading message="Connecting to database and fetching real travel data..." />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="d-flex flex-column gap-5 py-2"
    >
      {/* 1. HERO / WELCOME SECTION */}
      <motion.div variants={itemVariants}>
        <div className="gt-glass-card p-4 p-md-5 rounded-4 position-relative overflow-hidden shadow-lg border-0" style={{ background: "rgba(11, 16, 38, 0.85)" }}>
          {/* Ambient Glowing Gradient Mesh Blobs */}
          <div
            className="position-absolute top-0 start-0 rounded-circle animate-blob-1"
            style={{
              width: "450px",
              height: "450px",
              background: "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.1) 70%, transparent 100%)",
              filter: "blur(80px)",
              pointerEvents: "none"
            }}
          ></div>
          <div
            className="position-absolute bottom-0 end-0 rounded-circle animate-blob-2"
            style={{
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, rgba(6, 182, 212, 0.1) 70%, transparent 100%)",
              filter: "blur(80px)",
              pointerEvents: "none"
            }}
          ></div>

          <div className="row align-items-center position-relative z-1 g-4">
            <div className="col-lg-7">
              <span className="badge bg-white bg-opacity-10 text-white px-3.5 py-2 rounded-pill fw-semibold mb-3 border border-white border-opacity-20 d-inline-flex align-items-center gap-2 font-heading">
                <span className="pulse-dot bg-saas-gradient rounded-circle" style={{ width: "8px", height: "8px" }}></span>
                {getGreeting()}, {user?.name || "Traveler"} 👋
              </span>

              <h1 className="font-heading display-4 fw-extrabold text-white mb-3" style={{ lineHeight: 1.15 }}>
                Your next adventure <br />
                <span className="text-saas-gradient">starts here.</span>
              </h1>

              <p className="text-white-50 lead fs-6 mb-4 max-w-lg font-heading">
                Plan, organize and experience your perfect journey with multi-city routes and smart travel budgets.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/create-trip" className="btn btn-gt-primary px-4 py-2.5 rounded-3 font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-plus-circle-fill fs-5"></i>
                  <span>Plan New Trip</span>
                </Link>
                <Link to="/cities" className="btn btn-gt-outline px-4 py-2.5 rounded-3 font-heading fw-semibold d-flex align-items-center gap-2">
                  <i className="bi bi-compass fs-5 me-1"></i>
                  <span>Explore Destinations</span>
                </Link>
              </div>
            </div>

            {/* Glassmorphism Real Database Statistics Card */}
            <div className="col-lg-5">
              <div className="gt-glass-card p-4 rounded-4 border border-white border-opacity-20 shadow-lg">
                <h5 className="font-heading fw-bold text-white mb-3 d-flex align-items-center justify-content-between">
                  <span>Travel Overview</span>
                  <i className="bi bi-bar-chart-line text-saas-gradient fs-4"></i>
                </h5>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-white border-opacity-10">
                      <div className="display-6 fw-extrabold text-saas-gradient font-heading">{totalTripsCount}</div>
                      <div className="text-white-50 small font-heading">Trips Planned</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-white border-opacity-10">
                      <div className="display-6 fw-extrabold text-white font-heading">{totalCitiesCount}</div>
                      <div className="text-white-50 small font-heading">Places Saved</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-white border-opacity-10">
                      <div className="display-6 fw-extrabold text-white font-heading">{totalActivitiesCount}</div>
                      <div className="text-white-50 small font-heading">Activities Done</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-white border-opacity-10">
                      <div className="display-6 fw-extrabold text-warning font-heading">{upcomingEventsCount}</div>
                      <div className="text-white-50 small font-heading">Upcoming Trips</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. PLAN YOUR JOURNEY SECTION */}
      <motion.div variants={itemVariants}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-extrabold text-white mb-1">Plan Your Journey</h4>
            <p className="text-muted small mb-0 font-heading">Quick shortcuts to kickstart your travel activities.</p>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-6 col-md-3">
            <Link to="/create-trip" className="text-decoration-none">
              <div className="gt-glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="p-2.5 rounded-3 bg-saas-gradient text-white d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px" }}>
                    <i className="bi bi-plus-circle fs-4"></i>
                  </div>
                  <i className="bi bi-arrow-up-right text-white-50 fs-5"></i>
                </div>
                <div>
                  <h6 className="font-heading fw-bold text-white mb-1">Plan New Trip</h6>
                  <p className="text-muted small mb-0 font-heading">Start a new adventure</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-6 col-md-3">
            <Link to="/cities" className="text-decoration-none">
              <div className="gt-glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="p-2.5 rounded-3 bg-indigo-gradient text-white d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px" }}>
                    <i className="bi bi-globe fs-4"></i>
                  </div>
                  <i className="bi bi-arrow-up-right text-white-50 fs-5"></i>
                </div>
                <div>
                  <h6 className="font-heading fw-bold text-white mb-1">Explore Cities</h6>
                  <p className="text-muted small mb-0 font-heading">Discover destinations</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-6 col-md-3">
            <Link to={firstTripId ? `/calendar/${firstTripId}` : "/my-trips"} className="text-decoration-none">
              <div className="gt-glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="p-2.5 rounded-3 bg-cyan-gradient text-white d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px" }}>
                    <i className="bi bi-calendar3 fs-4"></i>
                  </div>
                  <i className="bi bi-arrow-up-right text-white-50 fs-5"></i>
                </div>
                <div>
                  <h6 className="font-heading fw-bold text-white mb-1">View Calendar</h6>
                  <p className="text-muted small mb-0 font-heading">See your travel schedule</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-6 col-md-3">
            <Link to={firstTripId ? `/budget/${firstTripId}` : "/my-trips"} className="text-decoration-none">
              <div className="gt-glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="p-2.5 rounded-3 bg-saas-gradient text-white d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px" }}>
                    <i className="bi bi-wallet2 fs-4"></i>
                  </div>
                  <i className="bi bi-arrow-up-right text-white-50 fs-5"></i>
                </div>
                <div>
                  <h6 className="font-heading fw-bold text-white mb-1">Check Budget</h6>
                  <p className="text-muted small mb-0 font-heading">Track your expenses</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 3. YOUR TRIPS (REAL USER DATA FROM MYSQL) */}
      <motion.div variants={itemVariants}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-extrabold text-white mb-1">Your Trips</h4>
            <p className="text-muted small mb-0 font-heading">Recent and upcoming multi-city itineraries.</p>
          </div>
          <Link to="/my-trips" className="btn btn-gt-outline btn-sm fw-semibold font-heading">
            View All Trips <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {realTrips.length > 0 ? (
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

      {/* 4. REAL CITIES FROM MYSQL DATABASE */}
      <motion.div variants={itemVariants}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-extrabold text-white mb-1">Explore Destinations</h4>
            <p className="text-muted small mb-0 font-heading">Real iconic cities fetched from MySQL database.</p>
          </div>
          <Link to="/cities" className="btn btn-gt-outline btn-sm fw-semibold font-heading">
            Explore All <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {realCities.length > 0 ? (
          <div className="row g-4">
            {realCities.map((city) => (
              <div key={city.id} className="col-md-6 col-lg-4">
                <DestinationCard city={city} isSaved={savedCityIds.includes(city.id)} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No destinations loaded 🌎"
            description="Explore all cities in our destination directory."
            actionLabel="Explore Cities"
            actionPath="/cities"
          />
        )}
      </motion.div>

      {/* 5. REAL BUDGET HIGHLIGHTS FROM MYSQL DATABASE */}
      <motion.div variants={itemVariants}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="font-heading fw-extrabold text-white mb-1">Trip Budget Highlights</h4>
            <p className="text-muted small mb-0 font-heading">Real financial allocation summary for active trip.</p>
          </div>
          {firstTripId ? (
            <Link to={`/budget/${firstTripId}`} className="btn btn-gt-outline btn-sm fw-semibold font-heading">
              Full Breakdown <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          ) : (
            <Link to="/my-trips" className="btn btn-gt-outline btn-sm fw-semibold font-heading">
              My Trips <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          )}
        </div>

        <div className="gt-glass-card p-4 p-md-5">
          <div className="row align-items-center mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <span className="badge bg-dark text-saas-gradient border border-primary fw-bold px-3 py-1 mb-2 font-heading">
                Active: {activeTripName}
              </span>
              <h2 className="font-heading display-6 fw-extrabold text-white mb-0">
                {formatCurrency(activeTripBudget, currency)}
              </h2>
              <span className="text-muted fs-7 font-heading">Estimated Total Budget</span>
            </div>

            <div className="col-md-6 text-md-end">
              <div className="d-inline-flex gap-4 p-3 bg-dark rounded-4 border border-white border-opacity-10">
                <div>
                  <span className="text-muted fs-7 d-block font-heading">Total Logged Spent</span>
                  <span className="fw-extrabold text-white fs-5 font-heading">{formatCurrency(totalSpent, currency)}</span>
                </div>
                <div className="border-start border-white border-opacity-10 ps-4">
                  <span className="text-muted fs-7 d-block font-heading">Remaining</span>
                  <span className="fw-extrabold text-success fs-5 font-heading">{formatCurrency(remainingBudget, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between text-muted fs-7 mb-2 fw-semibold font-heading">
              <span>Budget Allocation</span>
              <span className="text-saas-gradient fw-bold">{progressPercentage}% Spent</span>
            </div>
            <div className="progress bg-dark" style={{ height: "12px", borderRadius: "10px" }}>
              <div
                className="progress-bar bg-saas-gradient"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <div className="row g-3 pt-3 border-top border-white border-opacity-10">
            {[
              { name: "Transport", amount: totals.transport, icon: "bi-airplane-fill", color: "#7C3AED" },
              { name: "Accommodation", amount: totals.accommodation, icon: "bi-building-fill", color: "#EC4899" },
              { name: "Activities", amount: totals.activities, icon: "bi-ticket-perforated-fill", color: "#F97316" },
              { name: "Meals", amount: totals.meals, icon: "bi-cup-hot-fill", color: "#06B6D4" }
            ].map((cat, idx) => (
              <div key={idx} className="col-6 col-sm-3">
                <div className="p-3 bg-dark bg-opacity-50 rounded-3 d-flex align-items-center gap-3 border border-white border-opacity-10">
                  <div
                    className="p-2 rounded-2 text-white d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: cat.color, width: "38px", height: "38px" }}
                  >
                    <i className={`bi ${cat.icon} fs-5`}></i>
                  </div>
                  <div>
                    <span className="text-muted fs-7 d-block font-heading">{cat.name}</span>
                    <span className="fw-bold text-white fs-6 font-heading">{formatCurrency(cat.amount, currency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
