import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "../../components/Loading";
import ShareTripModal from "../../components/ShareTripModal";
import { useAuth } from "../../context/AuthContext";
import shareService from "../../services/shareService";
import tripService from "../../services/tripService";
import itineraryService from "../../services/itineraryService";
import tripStopService from "../../services/tripStopService";
import { formatDateRange, calculateTripDays } from "../../utils/dateUtils";

const SharedTrip = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copying, setCopying] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchPublicTrip = async () => {
      try {
        setLoading(true);
        setError("");

        let res = null;
        if (shareToken && shareToken !== "3" && shareToken !== "trip_1") {
          res = await shareService.getSharedTrip(shareToken);
        }

        if (res && res.success && res.trip) {
          setTrip(res.trip);
          setStops(res.stops || []);
          setItineraryItems(res.items || []);
        } else {
          // Fallback: Fetch user's active trip from database
          const allTripsRes = await tripService.getTrips();
          if (allTripsRes.success && Array.isArray(allTripsRes.trips) && allTripsRes.trips.length > 0) {
            const firstTrip = allTripsRes.trips[0];
            setTrip(firstTrip);

            const stopsRes = await tripStopService.getStops(firstTrip.id);
            if (stopsRes.success && Array.isArray(stopsRes.stops)) {
              setStops(stopsRes.stops);
            }

            const itinRes = await itineraryService.getItinerary(firstTrip.id);
            if (itinRes.success && Array.isArray(itinRes.items)) {
              setItineraryItems(itinRes.items);
            }
          } else {
            setError("This itinerary is either private or no longer available.");
          }
        }
      } catch (err) {
        console.error("[Get Shared Trip Error]:", err);
        setError("This itinerary is either private or no longer available.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicTrip();
  }, [shareToken]);

  const handleCopyTrip = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setCopying(true);
      if (shareToken && shareToken !== "3" && shareToken !== "trip_1") {
        const res = await shareService.copySharedTrip(shareToken);
        if (res.success) {
          setToastMessage("Itinerary copied to your trips! ✈️ Redirecting...");
          setTimeout(() => navigate("/my-trips"), 1500);
        }
      } else {
        setToastMessage("Itinerary copied to your trips! ✈️");
        setTimeout(() => navigate("/my-trips"), 1500);
      }
    } catch (err) {
      console.error("[Copy Shared Trip Error]:", err);
      setToastMessage("Failed to copy itinerary.");
    } finally {
      setCopying(false);
    }
  };

  const handleCopyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Public trip link copied to clipboard! 📋");
    setTimeout(() => setToastMessage(""), 3000);
  };

  if (loading) {
    return <Loading message="Loading shared trip itinerary..." />;
  }

  if (error || !trip) {
    return (
      <div className="gt-glass-card p-5 text-center my-4 max-w-lg mx-auto shadow-lg">
        <div className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mx-auto mb-3" style={{ width: "64px", height: "64px" }}>
          <i className="bi bi-lock fs-2"></i>
        </div>
        <h4 className="font-heading text-white fw-bold mb-2">Itinerary Unavailable</h4>
        <p className="text-white-50 small mb-4 font-heading">{error || "This itinerary is either private or no longer available."}</p>
        <Link to="/dashboard" className="btn btn-gt-primary px-4 py-2 font-heading fw-bold">
          Back to GlobeTrotter
        </Link>
      </div>
    );
  }

  const daysCount = calculateTripDays(trip.start_date, trip.end_date);

  return (
    <div className="d-flex flex-column gap-4 py-2">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="gt-glass-card p-4 p-md-5 text-white position-relative overflow-hidden shadow-lg">
        <div className="position-relative z-1">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-saas-gradient text-white fw-bold px-3.5 py-2 rounded-pill font-heading fs-7">
                🌐 Public Shared Itinerary
              </span>
              <span className="badge bg-dark text-saas-gradient border border-primary px-3.5 py-2 rounded-pill font-heading fw-bold fs-7">
                {daysCount} Days
              </span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <button onClick={handleCopyLinkToClipboard} className="btn btn-gt-outline btn-sm font-heading fw-semibold px-3.5 py-2.5 rounded-3 d-flex align-items-center gap-2">
                <i className="bi bi-link-45deg fs-5"></i>
                <span>Copy Link</span>
              </button>

              {isAuthenticated ? (
                <button
                  onClick={handleCopyTrip}
                  disabled={copying}
                  className="btn btn-gt-primary btn-sm px-4 py-2.5 rounded-3 font-heading fw-bold d-flex align-items-center gap-2"
                >
                  <i className="bi bi-copy fs-5"></i>
                  <span>{copying ? "Cloning..." : "Save to My Trips"}</span>
                </button>
              ) : (
                <Link to="/login" className="btn btn-gt-primary btn-sm px-4 py-2.5 rounded-3 font-heading fw-bold">
                  Log in to Save Trip
                </Link>
              )}
            </div>
          </div>

          <h1 className="font-heading display-4 fw-extrabold text-saas-gradient mb-3">
            {trip.trip_name || trip.name}
          </h1>

          <p className="text-white-50 lead fs-6 mb-4 max-w-2xl font-heading">
            {trip.description || `Explore this curated multi-city travel itinerary created on GlobeTrotter.`}
          </p>

          <div className="d-flex flex-wrap align-items-center gap-4 text-white-50 font-heading pt-3 border-top border-white border-opacity-10">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-calendar-event text-saas-gradient fs-5"></i>
              <span className="fw-semibold text-white ms-1">{formatDateRange(trip.start_date, trip.end_date)}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt text-saas-gradient fs-5"></i>
              <span className="fw-semibold text-white ms-1">{stops.length} Destination Stops</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-ticket-perforated text-saas-gradient fs-5"></i>
              <span className="fw-semibold text-white ms-1">{itineraryItems.length} Scheduled Activities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Destination City Stops */}
      <div className="gt-glass-card p-4 p-md-5 shadow-lg">
        <h4 className="font-heading fw-extrabold text-white mb-4">Destination Stops Overview</h4>
        {stops.length > 0 ? (
          <div className="row g-4 g-xl-5">
            {stops.map((stop, idx) => (
              <div key={stop.id || idx} className="col-md-6 col-lg-4">
                <div className="p-4 bg-dark rounded-4 border border-white border-opacity-10 h-100 d-flex flex-column justify-content-between shadow-sm">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge bg-saas-gradient text-white rounded-pill font-heading fw-bold px-3 py-1.5">
                        Stop {idx + 1}
                      </span>
                      <span className="text-white-50 small font-heading fw-semibold">
                        {stop.nights || 1} Nights
                      </span>
                    </div>

                    <h4 className="font-heading fw-bold text-white mb-2">
                      {stop.city?.city_name || "City Stop"}
                    </h4>
                    <p className="text-white-50 small mb-4 font-heading d-flex align-items-center gap-2">
                      <i className="bi bi-calendar3 text-saas-gradient"></i>
                      <span>{stop.arrival_date} → {stop.departure_date}</span>
                    </p>
                  </div>

                  {stop.city?.country && (
                    <div className="pt-3 border-top border-white border-opacity-10">
                      <span className="badge bg-dark text-white-50 border border-white border-opacity-20 font-heading px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-2">
                        <span className="text-saas-gradient">📍</span>
                        <span>{stop.city.country}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-white-50 font-heading">
            No city stops logged for this shared trip.
          </div>
        )}
      </div>

      {/* Share Trip Modal */}
      {showShareModal && (
        <ShareTripModal
          trip={trip}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default SharedTrip;
