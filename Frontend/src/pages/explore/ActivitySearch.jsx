import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import ActivityCard from "../../components/ActivityCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import cityService from "../../services/cityService";
import activityService from "../../services/activityService";
import tripService from "../../services/tripService";
import tripStopService from "../../services/tripStopService";
import itineraryService from "../../services/itineraryService";

const ActivitySearch = () => {
  const { cityId } = useParams();
  const activeCityId = cityId || "1";
  const navigate = useNavigate();

  const [city, setCity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Quick View Modal
  const [quickViewActivity, setQuickViewActivity] = useState(null);

  // Add Activity Modal State
  const [selectedActivityToAdd, setSelectedActivityToAdd] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [tripStops, setTripStops] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [itemNotes, setItemNotes] = useState("");
  const [submittingItem, setSubmittingItem] = useState(false);
  const [modalError, setModalError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Fetch City & Activities from MySQL database
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        const cityRes = await cityService.getCity(activeCityId);
        if (cityRes.success && cityRes.city) {
          setCity(cityRes.city);
        }

        const actRes = await activityService.getCityActivities(activeCityId, selectedCategory);
        if (actRes.success && Array.isArray(actRes.activities)) {
          setActivities(actRes.activities);
        }
      } catch (err) {
        console.error("[Fetch City Activities Error]:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [activeCityId, selectedCategory]);

  // Open Add Activity Modal
  const handleOpenAddModal = async (act) => {
    setSelectedActivityToAdd(act);
    setModalError("");
    setQuickViewActivity(null);
    try {
      const res = await tripService.getTrips();
      if (res.success && Array.isArray(res.trips)) {
        setUserTrips(res.trips);
        if (res.trips.length > 0) {
          const firstTrip = res.trips[0];
          setSelectedTripId(firstTrip.id);
          fetchStopsForTrip(firstTrip.id);
        }
      }
    } catch (err) {
      console.error("[Fetch Trips Error]:", err);
    }
  };

  const fetchStopsForTrip = async (tId) => {
    try {
      const res = await tripStopService.getStops(tId);
      if (res.success && Array.isArray(res.stops)) {
        setTripStops(res.stops);
        if (res.stops.length > 0) {
          const firstStop = res.stops[0];
          setSelectedStopId(firstStop.id);
          setItemDate(firstStop.arrival_date || "");
        } else {
          setTripStops([]);
          setSelectedStopId("");
        }
      }
    } catch (err) {
      console.error("[Fetch Stops Error]:", err);
      setTripStops([]);
    }
  };

  const handleTripChange = (e) => {
    const tId = e.target.value;
    setSelectedTripId(tId);
    fetchStopsForTrip(tId);
  };

  const handleStopChange = (e) => {
    const sId = e.target.value;
    setSelectedStopId(sId);
    const chosenStop = tripStops.find((s) => String(s.id) === String(sId));
    if (chosenStop) {
      setItemDate(chosenStop.arrival_date || "");
    }
  };

  // Submit Add Activity to Itinerary
  const handleAddItinerarySubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!selectedTripId) {
      setModalError("Please select a trip.");
      return;
    }

    if (!selectedStopId) {
      setModalError("Please select a city stop in your trip.");
      return;
    }

    if (!itemDate) {
      setModalError("Please select a date for this activity.");
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      setModalError("End time must be after start time.");
      return;
    }

    try {
      setSubmittingItem(true);
      const payload = {
        trip_stop_id: selectedStopId,
        activity_id: selectedActivityToAdd.id,
        date: itemDate,
        start_time: startTime,
        end_time: endTime,
        notes: itemNotes
      };

      const res = await itineraryService.addItem(selectedTripId, payload);
      if (res.success) {
        setToastMessage(`Added "${selectedActivityToAdd.activity_name || selectedActivityToAdd.name}" to your trip! ✈️`);
        setSelectedActivityToAdd(null);
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch (err) {
      console.error("[Add Itinerary Item Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to add activity. Check dates and try again.";
      setModalError(apiMsg);
    } finally {
      setSubmittingItem(false);
    }
  };

  // Client side search filter
  const filteredActivities = activities.filter((act) => {
    const nameStr = (act.activity_name || act.name || "").toLowerCase();
    return nameStr.includes(searchTerm.toLowerCase().trim());
  });

  return (
    <div className="d-flex flex-column gap-4 py-2">
      <PageHeader
        title={`Things to Do in ${city?.city_name || city?.name || "Destination"}`}
        subtitle={`Browse top sightseeing, food, adventure, and cultural activities in ${city?.country || ""}.`}
        breadcrumbs={[{ label: "Explore Cities", path: "/cities" }, { label: `${city?.city_name || "City"} Activities` }]}
      />

      {toastMessage && (
        <div className="alert alert-success d-flex align-items-center justify-content-between rounded-3 shadow-sm mb-4">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill fs-5"></i>
            <span>{toastMessage}</span>
          </div>
          <button className="btn btn-sm btn-gt-outline font-heading" onClick={() => navigate(`/itinerary/${selectedTripId}`)}>
            View Itinerary
          </button>
        </div>
      )}

      {/* City Hero Card */}
      {city && (
        <div
          className="gt-glass-card p-4 p-md-5 text-white mb-4 rounded-4 position-relative overflow-hidden shadow-lg border-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(7,11,26,0.92), rgba(7,11,26,0.6)), url(${city.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="position-relative z-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-saas-gradient text-white fw-bold font-heading">{city.region}</span>
              <span className="badge bg-dark text-saas-gradient border border-primary fw-bold font-heading">{city.cost_index}</span>
            </div>
            <h1 className="font-heading display-5 fw-extrabold text-white mb-2">{city.city_name}, {city.country}</h1>
            <p className="text-white-50 lead fs-6 mb-0 max-w-xl font-heading">{city.description}</p>
          </div>
        </div>
      )}

      {/* Prominent Full-Width Search & Filter Toolbar */}
      <div className="gt-glass-card p-4 p-md-4.5 mb-5 shadow-lg border-0">
        {/* Full Width Search Bar */}
        <div className="position-relative mb-4">
          <i className="bi bi-search position-absolute text-saas-gradient ms-4 top-50 translate-middle-y fs-5"></i>
          <input
            type="text"
            className="form-control form-control-lg rounded-pill ps-5 pe-5 bg-dark border border-white border-opacity-15 text-white font-heading shadow-sm"
            style={{ paddingLeft: "3.5rem", height: "54px", fontSize: "1rem" }}
            placeholder={`Search activities in ${city?.city_name || "this city"} by name or keyword...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-sm btn-link text-muted position-absolute end-0 top-50 translate-middle-y me-4 p-0 text-decoration-none"
              title="Clear Search"
            >
              <i className="bi bi-x-circle-fill fs-5 text-white-50"></i>
            </button>
          ) : (
            <span className="position-absolute end-0 top-50 translate-middle-y me-4 badge bg-dark border border-white border-opacity-10 text-white-50 font-heading px-3 py-1.5 fs-7">
              {filteredActivities.length} {filteredActivities.length === 1 ? "Activity" : "Activities"}
            </span>
          )}
        </div>

        {/* Category Filter Pills (Aligned with Even Spacing) */}
        <div className="d-flex align-items-center flex-wrap gap-3.5 pt-3 border-top border-white border-opacity-10">
          <span className="text-white-50 small font-heading fw-semibold me-1">
            <i className="bi bi-funnel-fill me-1.5 text-saas-gradient"></i> Filter Category:
          </span>

          <div className="d-flex align-items-center gap-3 flex-wrap font-heading">
            {["All", "Sightseeing", "Food", "Adventure", "Culture", "Shopping", "Nature"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm rounded-pill px-4 py-2 text-nowrap transition-all ${
                  selectedCategory === cat ? "bg-saas-gradient text-white fw-bold shadow-sm" : "btn-gt-outline text-white-50"
                }`}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Grid */}
      {loading ? (
        <Loading message="Loading city activities from database..." />
      ) : filteredActivities.length > 0 ? (
        <div className="row g-4 g-xl-5">
          {filteredActivities.map((act) => (
            <div key={act.id} className="col-md-6 col-lg-4">
              <ActivityCard
                activity={act}
                onAdd={handleOpenAddModal}
                onQuickView={() => setQuickViewActivity(act)}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No activities found"
          description="Try selecting a different category filter or search query."
        />
      )}

      {/* Quick View Details Modal */}
      {quickViewActivity && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(7,11,26,0.85)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content gt-glass-card border border-white border-opacity-20 shadow-lg overflow-hidden">
              <div className="position-relative" style={{ height: "250px" }}>
                <img
                  src={quickViewActivity.image}
                  alt={quickViewActivity.activity_name || quickViewActivity.name}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3 bg-dark p-2 rounded-circle"
                  onClick={() => setQuickViewActivity(null)}
                ></button>
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ background: "linear-gradient(to bottom, rgba(7,11,26,0.2), rgba(7,11,26,0.9))" }}
                ></div>
                <div className="position-absolute bottom-0 start-0 m-4 text-white">
                  <span className="badge bg-saas-gradient text-white fw-bold mb-2 font-heading">{quickViewActivity.category}</span>
                  <h3 className="font-heading fw-extrabold text-white mb-0">{quickViewActivity.activity_name || quickViewActivity.name}</h3>
                </div>
              </div>

              <div className="modal-body p-4">
                <p className="text-white-50 lead fs-6 mb-4 font-heading">{quickViewActivity.description}</p>

                <div className="row g-3 p-3 bg-dark rounded-4 border border-white border-opacity-10 mb-4">
                  <div className="col-4 text-center border-end border-white border-opacity-10">
                    <span className="text-white-50 fs-7 d-block font-heading">Duration</span>
                    <span className="fw-bold text-white font-heading">{quickViewActivity.duration || "2 hours"}</span>
                  </div>
                  <div className="col-4 text-center border-end border-white border-opacity-10">
                    <span className="text-white-50 fs-7 d-block font-heading">Cost</span>
                    <span className="fw-bold text-white font-heading">
                      {parseFloat(quickViewActivity.cost || 0) > 0 ? `€${quickViewActivity.cost}` : "Free"}
                    </span>
                  </div>
                  <div className="col-4 text-center">
                    <span className="text-white-50 fs-7 d-block font-heading">Rating</span>
                    <span className="fw-bold text-warning font-heading">
                      <i className="bi bi-star-fill me-1"></i>
                      {quickViewActivity.rating || "4.8"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top border-white border-opacity-10">
                <button type="button" className="btn btn-gt-outline font-heading" onClick={() => setQuickViewActivity(null)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-gt-primary px-4 fw-bold font-heading"
                  onClick={() => handleOpenAddModal(quickViewActivity)}
                >
                  Add to Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity to Trip Modal */}
      {selectedActivityToAdd && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(7,11,26,0.85)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content gt-glass-card border border-white border-opacity-20 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom border-white border-opacity-10 text-white">
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-plus-circle text-saas-gradient"></i>
                  Add Activity to Trip
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedActivityToAdd(null)}></button>
              </div>

              <form onSubmit={handleAddItinerarySubmit}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-dark rounded-3 mb-3 border border-white border-opacity-10">
                    <h6 className="fw-bold text-white font-heading mb-1">{selectedActivityToAdd.activity_name || selectedActivityToAdd.name}</h6>
                    <span className="text-white-50 small font-heading">{selectedActivityToAdd.category} • {selectedActivityToAdd.duration || "2 hours"}</span>
                  </div>

                  {modalError && (
                    <div className="alert alert-danger small p-2 mb-3 rounded-3">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {modalError}
                    </div>
                  )}

                  {userTrips.length > 0 ? (
                    <>
                      {/* Select Trip */}
                      <div className="mb-3">
                        <label className="form-label text-white fw-semibold small font-heading">Choose Trip</label>
                        <select className="form-select bg-dark text-white border-white border-opacity-20" value={selectedTripId} onChange={handleTripChange}>
                          {userTrips.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.trip_name || t.name} ({t.start_date} – {t.end_date})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Select Stop */}
                      {tripStops.length > 0 ? (
                        <div className="mb-3">
                          <label className="form-label text-white fw-semibold small font-heading">Choose City Stop</label>
                          <select className="form-select bg-dark text-white border-white border-opacity-20" value={selectedStopId} onChange={handleStopChange}>
                            {tripStops.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.city?.city_name || s.cityName || "Stop"} ({s.arrival_date} – {s.departure_date})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="alert alert-warning small p-2 mb-3">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          This trip does not have any city stops yet. Add a city stop to the trip first!
                        </div>
                      )}

                      {/* Date & Time */}
                      {tripStops.length > 0 && (
                        <>
                          <div className="mb-3">
                            <label className="form-label text-white fw-semibold small font-heading">Activity Date</label>
                            <input
                              type="date"
                              className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                              value={itemDate}
                              onChange={(e) => setItemDate(e.target.value)}
                              required
                            />
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
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-white-50 small mb-3 font-heading">You don't have any trips created yet.</p>
                      <button
                        type="button"
                        className="btn btn-gt-primary btn-sm px-4 fw-bold font-heading"
                        onClick={() => {
                          setSelectedActivityToAdd(null);
                          navigate("/create-trip");
                        }}
                      >
                        Create Trip First
                      </button>
                    </div>
                  )}
                </div>

                {userTrips.length > 0 && tripStops.length > 0 && (
                  <div className="modal-footer border-top border-white border-opacity-10">
                    <button type="button" className="btn btn-gt-outline btn-sm font-heading" onClick={() => setSelectedActivityToAdd(null)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={submittingItem} className="btn btn-gt-primary btn-sm px-4 fw-bold font-heading">
                      {submittingItem ? "Adding Activity..." : "Add to Itinerary"}
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

export default ActivitySearch;
