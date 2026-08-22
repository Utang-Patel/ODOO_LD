import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import tripService from "../../services/tripService";
import cityService from "../../services/cityService";
import activityService from "../../services/activityService";
import tripStopService from "../../services/tripStopService";
import itineraryService from "../../services/itineraryService";
import { formatDateRange, calculateTripDays } from "../../utils/dateUtils";

const ItineraryBuilder = () => {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Add City Stop Modal State
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [stopArrivalDate, setStopArrivalDate] = useState("");
  const [stopDepartureDate, setStopDepartureDate] = useState("");
  const [addingStop, setAddingStop] = useState(false);
  const [stopModalError, setStopModalError] = useState("");

  // Add Activity Modal State
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);
  const [cityActivities, setCityActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [itemNotes, setItemNotes] = useState("");
  const [addingActivity, setAddingActivity] = useState(false);
  const [activityModalError, setActivityModalError] = useState("");

  const fetchTripData = async () => {
    try {
      setLoading(true);
      setError("");

      const tripRes = await tripService.getTrip(tripId);
      if (tripRes.success && tripRes.trip) {
        setTrip(tripRes.trip);
      } else {
        setError("Trip not found.");
        return;
      }

      const stopsRes = await tripStopService.getStops(tripId);
      if (stopsRes.success && Array.isArray(stopsRes.stops)) {
        setStops(stopsRes.stops);
      }

      const itinRes = await itineraryService.getItinerary(tripId);
      if (itinRes.success && Array.isArray(itinRes.items)) {
        setItineraryItems(itinRes.items);
      }
    } catch (err) {
      console.error("[Fetch Itinerary Error]:", err);
      setError("Unable to load itinerary details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  // Open Add Stop Modal
  const handleOpenAddStopModal = async () => {
    setStopModalError("");
    setShowAddStopModal(true);
    if (trip) {
      setStopArrivalDate(trip.start_date || "");
      setStopDepartureDate(trip.end_date || "");
    }
    try {
      const res = await cityService.getCities();
      if (res.success && Array.isArray(res.cities)) {
        setAvailableCities(res.cities);
        if (res.cities.length > 0) {
          setSelectedCityId(res.cities[0].id);
        }
      }
    } catch (err) {
      console.error("[Fetch Cities Error]:", err);
    }
  };

  // Submit Add Stop
  const handleAddStopSubmit = async (e) => {
    e.preventDefault();
    setStopModalError("");

    if (!selectedCityId) {
      setStopModalError("Please select a city.");
      return;
    }

    if (!stopArrivalDate || !stopDepartureDate) {
      setStopModalError("Arrival and departure dates are required.");
      return;
    }

    if (new Date(stopDepartureDate) < new Date(stopArrivalDate)) {
      setStopModalError("Departure date cannot be before arrival date.");
      return;
    }

    try {
      setAddingStop(true);
      const res = await tripStopService.addStop(tripId, {
        city_id: selectedCityId,
        arrival_date: stopArrivalDate,
        departure_date: stopDepartureDate
      });

      if (res.success) {
        setToastMessage("City stop added to itinerary! ✈️");
        setShowAddStopModal(false);
        fetchTripData();
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("[Add Stop Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to add stop. Check trip dates.";
      setStopModalError(apiMsg);
    } finally {
      setAddingStop(false);
    }
  };

  // Delete Stop
  const handleDeleteStop = async (stopId) => {
    if (!window.confirm("Are you sure you want to remove this city stop from your itinerary?")) return;
    try {
      await tripStopService.deleteStop(tripId, stopId);
      setStops((prev) => prev.filter((s) => s.id !== stopId));
      setToastMessage("City stop removed.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("[Delete Stop Error]:", err);
    }
  };

  // Reorder Stops (Move Up / Down)
  const handleMoveStop = async (index, direction) => {
    const newStops = [...stops];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStops.length) return;

    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    setStops(newStops);
    try {
      const stopIds = newStops.map((s) => s.id);
      await tripStopService.reorderStops(tripId, stopIds);
    } catch (err) {
      console.error("[Reorder Stops Error]:", err);
    }
  };

  // Open Add Activity Modal for a Stop
  const handleOpenAddActivityModal = async (stop) => {
    setActiveStopForActivity(stop);
    setActivityModalError("");
    setItemDate(stop.arrival_date || "");

    try {
      const res = await activityService.getCityActivities(stop.city_id);
      if (res.success && Array.isArray(res.activities)) {
        setCityActivities(res.activities);
        if (res.activities.length > 0) {
          setSelectedActivityId(res.activities[0].id);
        }
      }
    } catch (err) {
      console.error("[Fetch City Activities Error]:", err);
    }
  };

  // Submit Add Activity to Itinerary
  const handleAddActivitySubmit = async (e) => {
    e.preventDefault();
    setActivityModalError("");

    if (!selectedActivityId) {
      setActivityModalError("Please select an activity.");
      return;
    }

    if (!itemDate) {
      setActivityModalError("Please select a date.");
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      setActivityModalError("End time must be after start time.");
      return;
    }

    try {
      setAddingActivity(true);
      const payload = {
        trip_stop_id: activeStopForActivity.id,
        activity_id: selectedActivityId,
        date: itemDate,
        start_time: startTime,
        end_time: endTime,
        notes: itemNotes
      };

      const res = await itineraryService.addItem(tripId, payload);
      if (res.success) {
        setToastMessage("Activity added to itinerary! 🗼");
        setActiveStopForActivity(null);
        fetchTripData();
        setTimeout(() => setToastMessage(""), 3000);
      }
    } catch (err) {
      console.error("[Add Activity Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to add activity. Check date bounds.";
      setActivityModalError(apiMsg);
    } finally {
      setAddingActivity(false);
    }
  };

  // Delete Itinerary Item
  const handleDeleteItineraryItem = async (itemId) => {
    try {
      await itineraryService.deleteItem(tripId, itemId);
      setItineraryItems((prev) => prev.filter((i) => i.id !== itemId));
      setToastMessage("Activity removed from itinerary.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("[Delete Itinerary Item Error]:", err);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Sightseeing": return "#7C3AED";
      case "Food": return "#EC4899";
      case "Adventure": return "#F97316";
      case "Culture": return "#8B5CF6";
      case "Shopping": return "#06B6D4";
      case "Nature":
      default: return "#10B981";
    }
  };

  if (loading) {
    return <Loading message="Building your journey..." />;
  }

  if (error || !trip) {
    return (
      <div className="gt-glass-card p-5 text-center my-4">
        <h5 className="font-heading text-white fw-bold mb-2">{error || "Trip not found"}</h5>
        <Link to="/my-trips" className="btn btn-gt-primary px-4 font-heading">Back to My Trips</Link>
      </div>
    );
  }

  const dateFormatted = formatDateRange(trip.start_date, trip.end_date);
  const totalDays = calculateTripDays(trip.start_date, trip.end_date);

  return (
    <div>
      <PageHeader
        title={`${trip.trip_name || trip.name} — Itinerary Builder`}
        subtitle={`${dateFormatted} • ${totalDays} Days • ${stops.length} Cities`}
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Itinerary Builder" }]}
        action={
          <div className="d-flex gap-2">
            <Link to={`/itinerary/${trip.id}/view`} className="btn btn-gt-outline btn-sm fw-semibold font-heading">
              <i className="bi bi-eye me-1"></i> Preview Itinerary
            </Link>
            <button onClick={handleOpenAddStopModal} className="btn btn-gt-primary btn-sm fw-bold font-heading">
              <i className="bi bi-plus-circle me-1"></i> Add City Stop
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

      {/* Multi-City Stops Breakdown */}
      {stops.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {stops.map((stop, index) => {
            const cityName = stop.city?.city_name || "City";
            const countryName = stop.city?.country || "";
            const flag = stop.city?.country_code || "🌎";

            // Filter itinerary items belonging to this stop
            const stopItems = itineraryItems.filter((item) => String(item.trip_stop_id) === String(stop.id));

            return (
              <div key={stop.id} className="gt-glass-card p-4 p-md-5">
                {/* Stop Header */}
                <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-4 border-bottom border-white border-opacity-10 gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-saas-gradient text-white fs-6 p-2 rounded-3 fw-bold font-heading">
                      STOP {index + 1}
                    </span>
                    <div>
                      <h3 className="font-heading fw-extrabold text-white mb-0">
                        {cityName.toUpperCase()} <span className="fs-6 text-white-50 font-sans font-normal">({countryName}) {flag}</span>
                      </h3>
                      <span className="text-white-50 small font-heading">
                        <i className="bi bi-calendar-event me-1 text-saas-gradient"></i>
                        {formatDateRange(stop.arrival_date, stop.departure_date)} ({calculateTripDays(stop.arrival_date, stop.departure_date)} Days)
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* Reorder Buttons */}
                    <button
                      onClick={() => handleMoveStop(index, "up")}
                      disabled={index === 0}
                      className="btn btn-sm btn-gt-outline px-2.5"
                      title="Move Stop Up"
                    >
                      <i className="bi bi-arrow-up"></i>
                    </button>
                    <button
                      onClick={() => handleMoveStop(index, "down")}
                      disabled={index === stops.length - 1}
                      className="btn btn-sm btn-gt-outline px-2.5"
                      title="Move Stop Down"
                    >
                      <i className="bi bi-arrow-down"></i>
                    </button>

                    <button
                      onClick={() => handleDeleteStop(stop.id)}
                      className="btn btn-outline-danger btn-sm rounded-pill px-3 font-heading"
                    >
                      <i className="bi bi-trash me-1"></i> Remove Stop
                    </button>
                  </div>
                </div>

                {/* Day-Wise Activity Timeline */}
                <div className="d-flex flex-column gap-3 mb-4">
                  {stopItems.length > 0 ? (
                    stopItems.map((item) => {
                      const actName = item.activity?.activity_name || item.activity?.name || "Activity";
                      const cat = item.activity?.category || "Sightseeing";
                      const cost = parseFloat(item.activity?.cost || 0);

                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-dark bg-opacity-60 rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border border-white border-opacity-10 transition-all hover-shadow"
                        >
                          <div className="d-flex align-items-center gap-3">
                            {/* Category Indicator Dot */}
                            <span
                              className="rounded-circle d-inline-block"
                              style={{ width: "12px", height: "12px", backgroundColor: getCategoryColor(cat) }}
                            ></span>

                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge bg-dark text-white border border-white border-opacity-20 fw-bold px-2 py-1 small font-heading">
                                  <i className="bi bi-clock me-1 text-saas-gradient"></i>
                                  {item.start_time} – {item.end_time}
                                </span>
                                <span className="badge bg-saas-gradient text-white px-2 py-1 small font-heading">{cat}</span>
                              </div>
                              <h6 className="mb-0 font-heading fw-bold text-white">{actName}</h6>
                              {item.notes && <p className="text-white-50 small mb-0 mt-1">{item.notes}</p>}
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-3 ms-auto">
                            <span className="fw-extrabold text-white fs-6 font-heading">
                              {cost > 0 ? `€${cost}` : "Free"}
                            </span>
                            <button
                              onClick={() => handleDeleteItineraryItem(item.id)}
                              className="btn btn-sm btn-link text-danger p-0"
                              title="Remove Activity"
                            >
                              <i className="bi bi-x-circle fs-5"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 bg-dark bg-opacity-50 rounded-4 border border-dashed border-white border-opacity-10">
                      <p className="text-white-50 small mb-0 font-heading">Nothing planned for this city stop yet.</p>
                    </div>
                  )}
                </div>

                {/* Add Activity Action Button */}
                <button
                  type="button"
                  onClick={() => handleOpenAddActivityModal(stop)}
                  className="btn btn-gt-outline btn-sm w-100 py-2.5 font-heading fw-semibold d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-plus-circle-fill fs-6 text-saas-gradient"></i>
                  <span>Add Activity to {cityName}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No destinations added yet 🌎"
          description="Start building your multi-city itinerary by adding your first city stop."
          actionLabel="Add City Stop"
          onAction={handleOpenAddStopModal}
        />
      )}

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(7,11,26,0.85)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content gt-glass-card border border-white border-opacity-20 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom border-white border-opacity-10 text-white">
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt text-saas-gradient"></i> Add City Stop
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddStopModal(false)}></button>
              </div>

              <form onSubmit={handleAddStopSubmit}>
                <div className="modal-body p-4">
                  {stopModalError && (
                    <div className="alert alert-danger small p-2 mb-3 rounded-3">
                      <i className="bi bi-exclamation-circle me-1"></i> {stopModalError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label text-white fw-semibold font-heading">Select City</label>
                    <select
                      className="form-select bg-dark text-white border-white border-opacity-20"
                      value={selectedCityId}
                      onChange={(e) => setSelectedCityId(e.target.value)}
                      required
                    >
                      {availableCities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.city_name || c.name}, {c.country} ({c.cost_index})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label text-white fw-semibold small font-heading">Arrival Date</label>
                      <input
                        type="date"
                        className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                        value={stopArrivalDate}
                        onChange={(e) => setStopArrivalDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-white fw-semibold small font-heading">Departure Date</label>
                      <input
                        type="date"
                        className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                        value={stopDepartureDate}
                        onChange={(e) => setStopDepartureDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top border-white border-opacity-10">
                  <button type="button" className="btn btn-gt-outline btn-sm font-heading" onClick={() => setShowAddStopModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={addingStop} className="btn btn-gt-primary btn-sm px-4 fw-bold font-heading">
                    {addingStop ? "Adding..." : "Add City Stop"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity to Stop Modal */}
      {activeStopForActivity && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(7,11,26,0.85)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content gt-glass-card border border-white border-opacity-20 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom border-white border-opacity-10 text-white">
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-plus-circle text-saas-gradient"></i> Add Activity to {activeStopForActivity.city?.city_name || "Stop"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setActiveStopForActivity(null)}></button>
              </div>

              <form onSubmit={handleAddActivitySubmit}>
                <div className="modal-body p-4">
                  {activityModalError && (
                    <div className="alert alert-danger small p-2 mb-3 rounded-3">
                      <i className="bi bi-exclamation-circle me-1"></i> {activityModalError}
                    </div>
                  )}

                  {cityActivities.length > 0 ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label text-white fw-semibold small font-heading">Select Activity</label>
                        <select
                          className="form-select bg-dark text-white border-white border-opacity-20"
                          value={selectedActivityId}
                          onChange={(e) => setSelectedActivityId(e.target.value)}
                          required
                        >
                          {cityActivities.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.activity_name || a.name} ({a.category} • {a.duration})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-white fw-semibold small font-heading">Date</label>
                        <input
                          type="date"
                          className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                          value={itemDate}
                          onChange={(e) => setItemDate(e.target.value)}
                          min={activeStopForActivity.arrival_date}
                          max={activeStopForActivity.departure_date}
                          required
                        />
                        <span className="text-white-50 fs-7 d-block mt-1 font-heading">
                          Must be between {activeStopForActivity.arrival_date} and {activeStopForActivity.departure_date}
                        </span>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <label className="form-label text-white fw-semibold small font-heading">Start Time</label>
                          <input
                            type="time"
                            className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-white fw-semibold small font-heading">End Time</label>
                          <input
                            type="time"
                            className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-white fw-semibold small font-heading">Notes (Optional)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                          placeholder="e.g. Booking ref, meeting spot..."
                          value={itemNotes}
                          onChange={(e) => setItemNotes(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-white-50 small mb-0 font-heading">No pre-seeded activities found for this city.</p>
                    </div>
                  )}
                </div>

                {cityActivities.length > 0 && (
                  <div className="modal-footer border-top border-white border-opacity-10">
                    <button type="button" className="btn btn-gt-outline btn-sm font-heading" onClick={() => setActiveStopForActivity(null)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={addingActivity} className="btn btn-gt-primary btn-sm px-4 fw-bold font-heading">
                      {addingActivity ? "Adding..." : "Add to Itinerary"}
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

export default ItineraryBuilder;
