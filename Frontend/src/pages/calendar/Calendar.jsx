import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import Timeline from "../../components/Timeline";
import tripService from "../../services/tripService";
import tripStopService from "../../services/tripStopService";
import activityService from "../../services/activityService";
import itineraryService from "../../services/itineraryService";
import { formatDateRange, calculateTripDays } from "../../utils/dateUtils";

const Calendar = () => {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("timeline"); // "timeline" or "month"
  const [toastMessage, setToastMessage] = useState("");

  // Expandable days state
  const [expandedDays, setExpandedDays] = useState({});

  // Quick Add Activity Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [availableStops, setAvailableStops] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState("");
  const [stopActivities, setStopActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [itemNotes, setItemNotes] = useState("");
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      let activeTripId = tripId;

      // Fallback: If tripId is missing or "trip_1", load user's first active trip from MySQL!
      if (!activeTripId || activeTripId === "trip_1") {
        const allTripsRes = await tripService.getTrips();
        if (allTripsRes.success && Array.isArray(allTripsRes.trips) && allTripsRes.trips.length > 0) {
          activeTripId = allTripsRes.trips[0].id;
        }
      }

      const tripRes = await tripService.getTrip(activeTripId);
      if (tripRes.success && tripRes.trip) {
        setTrip(tripRes.trip);
      } else {
        setError("No trip calendar details found.");
        return;
      }

      const stopsRes = await tripStopService.getStops(activeTripId);
      if (stopsRes.success && Array.isArray(stopsRes.stops)) {
        setStops(stopsRes.stops);
        setAvailableStops(stopsRes.stops);
      }

      const itinRes = await itineraryService.getItinerary(activeTripId);
      if (itinRes.success && Array.isArray(itinRes.items)) {
        setItineraryItems(itinRes.items);
      }
    } catch (err) {
      console.error("[Fetch Calendar Error]:", err);
      setError("Unable to load calendar details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tripId]);

  // Generate date array for trip dates
  const generateTripDates = () => {
    if (!trip || !trip.start_date || !trip.end_date) return [];
    const dates = [];
    const curr = new Date(trip.start_date);
    const end = new Date(trip.end_date);

    while (curr <= end) {
      dates.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  const tripDates = generateTripDates();

  // Set default expanded day (first day with activities or first day)
  useEffect(() => {
    if (tripDates.length > 0 && Object.keys(expandedDays).length === 0) {
      let defaultDay = tripDates[0];
      for (const d of tripDates) {
        const hasItems = itineraryItems.some((i) => i.date === d);
        if (hasItems) {
          defaultDay = d;
          break;
        }
      }
      setExpandedDays({ [defaultDay]: true });
    }
  }, [tripDates, itineraryItems]);

  const toggleExpand = (dateStr) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  // Open Quick Add Activity Modal
  const handleOpenAddModal = async (dateStr) => {
    setTargetDate(dateStr);
    setModalError("");
    setShowAddModal(true);

    // Find stop corresponding to dateStr
    const matchedStop = stops.find((s) => {
      const d = new Date(dateStr);
      return d >= new Date(s.arrival_date) && d <= new Date(s.departure_date);
    }) || stops[0];

    if (matchedStop) {
      setSelectedStopId(matchedStop.id);
      fetchActivitiesForStop(matchedStop.city_id);
    } else if (stops.length > 0) {
      setSelectedStopId(stops[0].id);
      fetchActivitiesForStop(stops[0].city_id);
    }
  };

  const fetchActivitiesForStop = async (cityId) => {
    try {
      const res = await activityService.getCityActivities(cityId);
      if (res.success && Array.isArray(res.activities)) {
        setStopActivities(res.activities);
        if (res.activities.length > 0) {
          setSelectedActivityId(res.activities[0].id);
        }
      }
    } catch (err) {
      console.error("[Fetch Activities Error]:", err);
    }
  };

  const handleStopChange = (e) => {
    const sId = e.target.value;
    setSelectedStopId(sId);
    const chosenStop = stops.find((s) => String(s.id) === String(sId));
    if (chosenStop) {
      fetchActivitiesForStop(chosenStop.city_id);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!selectedStopId) {
      setModalError("Please select a city stop.");
      return;
    }

    if (!selectedActivityId) {
      setModalError("Please select an activity.");
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      setModalError("End time must be after start time.");
      return;
    }

    try {
      setSubmittingActivity(true);
      const payload = {
        trip_stop_id: selectedStopId,
        activity_id: selectedActivityId,
        date: targetDate,
        start_time: startTime,
        end_time: endTime,
        notes: itemNotes
      };

      const res = await itineraryService.addItem(trip?.id, payload);
      if (res.success) {
        setToastMessage("Activity scheduled! 🗓️");
        setShowAddModal(false);
        setExpandedDays((prev) => ({ ...prev, [targetDate]: true }));
        fetchData();
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("[Add Activity Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to schedule activity.";
      setModalError(apiMsg);
    } finally {
      setSubmittingActivity(false);
    }
  };

  const handleDeleteActivity = async (itemId) => {
    try {
      await itineraryService.deleteItem(trip?.id, itemId);
      setItineraryItems((prev) => prev.filter((i) => i.id !== itemId));
      setToastMessage("Activity removed.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("[Delete Activity Error]:", err);
    }
  };

  if (loading) {
    return <Loading message="Loading calendar timeline..." />;
  }

  if (error || !trip) {
    return (
      <div className="gt-glass-card p-5 text-center my-4">
        <h5 className="font-heading text-white fw-bold mb-2">{error || "No trips planned yet"}</h5>
        <p className="text-white-50 small mb-4 font-heading">Plan your first trip to view schedule calendar details.</p>
        <Link to="/create-trip" className="btn btn-gt-primary px-4 font-heading fw-bold">Plan New Trip</Link>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div>
      <PageHeader
        title={`${trip.trip_name || trip.name} — Travel Calendar 🗓️`}
        subtitle={`${formatDateRange(trip.start_date, trip.end_date)} • ${calculateTripDays(trip.start_date, trip.end_date)} Days`}
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Calendar Timeline" }]}
        action={
          <div className="d-flex align-items-center gap-2 bg-dark p-1 rounded-pill border border-white border-opacity-10">
            <button
              onClick={() => setViewMode("timeline")}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-bold font-heading ${
                viewMode === "timeline" ? "bg-saas-gradient text-white shadow-sm" : "btn-link text-white-50 border-0 text-decoration-none"
              }`}
            >
              <i className="bi bi-card-list me-1"></i> Timeline
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-bold font-heading ${
                viewMode === "month" ? "bg-saas-gradient text-white shadow-sm" : "btn-link text-white-50 border-0 text-decoration-none"
              }`}
            >
              <i className="bi bi-calendar-month me-1"></i> Month Grid
            </button>
          </div>
        }
      />

      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Month Grid View */}
      {viewMode === "month" && (
        <div className="gt-glass-card p-4 p-md-5 mb-4">
          <h5 className="font-heading fw-extrabold text-white mb-4 text-center">
            Trip Dates Grid ({trip.start_date} → {trip.end_date})
          </h5>
          <div className="row g-3">
            {tripDates.map((dateStr, idx) => {
              const itemsForDay = itineraryItems.filter((i) => i.date === dateStr);
              const isToday = dateStr === todayStr;

              return (
                <div key={dateStr} className="col-6 col-md-4 col-lg-3">
                  <div
                    onClick={() => {
                      setViewMode("timeline");
                      setExpandedDays({ [dateStr]: true });
                    }}
                    className={`gt-glass-card p-3 text-center cursor-pointer transition-all hover-shadow ${
                      isToday ? "border-primary border-2" : ""
                    }`}
                  >
                    <span className="badge bg-saas-gradient text-white rounded-pill mb-2 font-heading">Day {idx + 1}</span>
                    <h6 className="font-heading fw-bold text-white mb-1">
                      {new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </h6>
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      {itemsForDay.length > 0 ? (
                        <span className="badge bg-dark text-saas-gradient border border-primary rounded-pill small font-heading">
                          ● {itemsForDay.length} Activities
                        </span>
                      ) : (
                        <span className="text-white-50 small">Empty</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vertical Timeline View */}
      {viewMode === "timeline" && (
        <div>
          {tripDates.length > 0 ? (
            tripDates.map((dateStr, idx) => {
              const dayItems = itineraryItems.filter((i) => i.date === dateStr);
              const isToday = dateStr === todayStr;
              const isPast = new Date(dateStr) < new Date(todayStr);

              return (
                <Timeline
                  key={dateStr}
                  dayDate={dateStr}
                  dayIndex={idx}
                  isExpanded={!!expandedDays[dateStr]}
                  onToggleExpand={() => toggleExpand(dateStr)}
                  isToday={isToday}
                  isPast={isPast}
                  items={dayItems}
                  onAddActivity={handleOpenAddModal}
                  onDeleteActivity={handleDeleteActivity}
                />
              );
            })
          ) : (
            <EmptyState
              title="No trip dates found"
              description="Check your trip start and end dates."
            />
          )}
        </div>
      )}

      {/* Quick Add Activity Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(7,11,26,0.85)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content gt-glass-card border border-white border-opacity-20 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom border-white border-opacity-10 text-white">
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-plus text-saas-gradient"></i> Add Activity for {targetDate}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="modal-body p-4">
                  {modalError && (
                    <div className="alert alert-danger small p-2 mb-3 rounded-3">
                      <i className="bi bi-exclamation-circle me-1"></i> {modalError}
                    </div>
                  )}

                  {stops.length > 0 ? (
                    <>
                      {/* Select City Stop */}
                      <div className="mb-3">
                        <label className="form-label text-white fw-semibold small font-heading">Choose City Stop</label>
                        <select className="form-select bg-dark text-white border-white border-opacity-20" value={selectedStopId} onChange={handleStopChange} required>
                          {stops.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.city?.city_name || "Stop"} ({s.arrival_date} – {s.departure_date})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Select Activity */}
                      {stopActivities.length > 0 ? (
                        <div className="mb-3">
                          <label className="form-label text-white fw-semibold small font-heading">Choose Activity</label>
                          <select className="form-select bg-dark text-white border-white border-opacity-20" value={selectedActivityId} onChange={(e) => setSelectedActivityId(e.target.value)} required>
                            {stopActivities.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.activity_name || a.name} ({a.category} • {a.duration})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="alert alert-warning small p-2 mb-3">
                          No activities found for this city stop.
                        </div>
                      )}

                      {/* Times */}
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <label className="form-label text-white fw-semibold small font-heading">Start Time</label>
                          <input type="time" className="form-control form-control-sm bg-dark text-white border-white border-opacity-20" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-white fw-semibold small font-heading">End Time</label>
                          <input type="time" className="form-control form-control-sm bg-dark text-white border-white border-opacity-20" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-3">
                        <label className="form-label text-white fw-semibold small font-heading">Notes (Optional)</label>
                        <input type="text" className="form-control form-control-sm bg-dark text-white border-white border-opacity-20" placeholder="e.g. Meeting point..." value={itemNotes} onChange={(e) => setItemNotes(e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-white-50 small mb-3">You need to add a city stop to your trip first.</p>
                      <Link to={`/itinerary/${trip.id}`} className="btn btn-gt-primary btn-sm font-heading">
                        Go to Itinerary Builder
                      </Link>
                    </div>
                  )}
                </div>

                {stops.length > 0 && stopActivities.length > 0 && (
                  <div className="modal-footer border-top border-white border-opacity-10">
                    <button type="button" className="btn btn-gt-outline btn-sm font-heading" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={submittingActivity} className="btn btn-gt-primary btn-sm px-4 fw-bold font-heading">
                      {submittingActivity ? "Scheduling..." : "Schedule Activity"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
