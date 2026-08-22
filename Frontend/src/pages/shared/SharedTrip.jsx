import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "../../components/Loading";
import ShareTripModal from "../../components/ShareTripModal";
import { useAuth } from "../../context/AuthContext";
import shareService from "../../services/shareService";
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

        const res = await shareService.getSharedTrip(shareToken);
        if (res.success && res.trip) {
          setTrip(res.trip);
          setStops(res.stops || []);
          setItineraryItems(res.items || []);
        } else {
          setError("This itinerary is no longer public.");
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
      const res = await shareService.copySharedTrip(shareToken);
      if (res.success) {
        setToastMessage("Itinerary copied to your trips! ✈️ Redirecting...");
        setTimeout(() => {
          navigate("/my-trips");
        }, 1500);
      }
    } catch (err) {
      console.error("[Copy Trip Error]:", err);
      setToastMessage("Unable to copy this itinerary. Please try again.");
    } finally {
      setCopying(false);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Sightseeing": return "#0EA5E9";
      case "Food": return "#FF8A3D";
      case "Adventure": return "#22C55E";
      case "Culture": return "#8B5CF6";
      case "Shopping": return "#FFD166";
      case "Nature":
      default: return "#06D6C9";
    }
  };

  if (loading) {
    return <Loading message="Loading public travel itinerary..." />;
  }

  if (error || !trip) {
    return (
      <div className="container py-5 text-center">
        <div className="gt-card p-5 max-w-xl mx-auto shadow-lg">
          <div className="d-flex align-items-center justify-content-center bg-warning bg-opacity-15 text-warning rounded-circle mx-auto mb-3" style={{ width: "72px", height: "72px" }}>
            <i className="bi bi-lock fs-1 text-navy-deep"></i>
          </div>
          <h3 className="font-heading text-navy-deep fw-bold mb-2">Itinerary Unavailable</h3>
          <p className="text-muted mb-4">{error || "This itinerary link is invalid or has been set to private."}</p>
          <Link to="/" className="btn btn-gt-primary px-4 py-2.5 fw-bold">
            Back to GlobeTrotter
          </Link>
        </div>
      </div>
    );
  }

  const dateFormatted = formatDateRange(trip.start_date, trip.end_date);
  const totalDays = calculateTripDays(trip.start_date, trip.end_date);

  return (
    <div className="container py-4">
      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Public Banner Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <span className="badge bg-ocean-gradient text-white fw-bold px-3 py-1.5 rounded-pill mb-2">
            Public Travel Itinerary 🌐
          </span>
          <h2 className="font-heading fw-extrabold text-navy-deep mb-0">{trip.trip_name || trip.name}</h2>
        </div>

        <div className="d-flex gap-2">
          <button onClick={() => setShowShareModal(true)} className="btn btn-gt-outline btn-sm fw-semibold">
            <i className="bi bi-share me-1"></i> Share
          </button>

          <button onClick={handleCopyTrip} disabled={copying} className="btn btn-gt-primary btn-sm fw-bold">
            <i className="bi bi-files me-1"></i> {copying ? "Copying..." : "Copy Trip"}
          </button>
        </div>
      </div>

      {/* Large Hero Card */}
      <div
        className="gt-card p-4 p-md-5 text-white mb-5 rounded-4 position-relative overflow-hidden shadow-lg border-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(7,26,43,0.93), rgba(7,26,43,0.6)), url(${trip.cover_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="position-relative z-1">
          <h1 className="font-heading display-4 fw-extrabold text-white mb-2">{trip.trip_name || trip.name}</h1>
          <p className="text-white-50 lead fs-6 max-w-2xl mb-4">{trip.description || "An unforgettable multi-city journey created on GlobeTrotter."}</p>

          <div className="d-flex flex-wrap align-items-center gap-4 pt-3 border-top border-white border-opacity-25">
            <div className="d-flex align-items-center gap-2 text-aqua fw-semibold">
              <i className="bi bi-calendar-event fs-5"></i>
              <span>{dateFormatted}</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-aqua fw-semibold">
              <i className="bi bi-clock-history fs-5"></i>
              <span>{totalDays} {totalDays === 1 ? "Day" : "Days"}</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-aqua fw-semibold">
              <i className="bi bi-geo-alt fs-5"></i>
              <span>{stops.length} {stops.length === 1 ? "City Stop" : "City Stops"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Travel Route Line */}
      {stops.length > 0 && (
        <div className="gt-card p-4 mb-5">
          <h5 className="font-heading fw-extrabold text-navy-deep mb-3">Travel Route</h5>
          <div className="d-flex flex-wrap align-items-center gap-3">
            {stops.map((stop, idx) => (
              <React.Fragment key={stop.id}>
                <div className="d-flex align-items-center gap-2 p-2.5 bg-light rounded-3 border">
                  <span className="badge bg-navy-deep text-aqua fw-bold">{idx + 1}</span>
                  <span className="fw-bold text-navy-deep">{stop.city?.city_name || "City"}</span>
                  <span className="text-muted small">({stop.city?.country_code || "WORLD"})</span>
                </div>
                {idx < stops.length - 1 && (
                  <span className="text-ocean-blue fs-5 fw-bold">✈️</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day Itinerary Timeline */}
      <h4 className="font-heading fw-extrabold text-navy-deep mb-4">Day-by-Day Itinerary</h4>

      {stops.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {stops.map((stop, idx) => {
            const cityName = stop.city?.city_name || "City";
            const countryName = stop.city?.country || "";
            const stopItems = itineraryItems.filter((i) => String(i.trip_stop_id) === String(stop.id));

            return (
              <div key={stop.id} className="gt-card p-4 p-md-5">
                <div className="d-flex align-items-center gap-3 pb-3 mb-4 border-bottom">
                  <span className="badge bg-navy-deep text-aqua fs-6 p-2 rounded-3 fw-bold">
                    STOP {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-heading fw-extrabold text-navy-deep mb-0">
                      {cityName}, {countryName}
                    </h4>
                    <span className="text-muted small">{formatDateRange(stop.arrival_date, stop.departure_date)}</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {stopItems.length > 0 ? (
                    stopItems.map((item) => {
                      const actName = item.activity?.activity_name || item.activity?.name || "Activity";
                      const cat = item.activity?.category || "Sightseeing";
                      const cost = parseFloat(item.activity?.cost || 0);

                      return (
                        <div key={item.id} className="p-3 bg-light rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border">
                          <div className="d-flex align-items-center gap-3">
                            <span
                              className="rounded-circle d-inline-block"
                              style={{ width: "12px", height: "12px", backgroundColor: getCategoryColor(cat) }}
                            ></span>
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge bg-white text-navy-deep border fw-bold px-2 py-1 small">
                                  {item.start_time} – {item.end_time}
                                </span>
                                <span className="badge bg-navy-deep text-aqua px-2 py-1 small">{cat}</span>
                              </div>
                              <h6 className="mb-0 font-heading fw-bold text-navy-deep">{actName}</h6>
                              {item.notes && <p className="text-muted small mb-0 mt-1">{item.notes}</p>}
                            </div>
                          </div>

                          <span className="fw-extrabold text-navy-deep fs-6">
                            {cost > 0 ? `€${cost}` : "Free"}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted small mb-0 py-2">No activities scheduled for this stop.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="gt-card p-5 text-center">
          <p className="text-muted mb-0">This itinerary has no city stops added yet.</p>
        </div>
      )}

      {/* Share Modal */}
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
