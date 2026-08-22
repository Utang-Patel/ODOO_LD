import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import DestinationCard from "../../components/DestinationCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import cityService from "../../services/cityService";
import tripService from "../../services/tripService";
import tripStopService from "../../services/tripStopService";
import savedDestinationService from "../../services/savedDestinationService";

const CitySearch = () => {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [savedCityIds, setSavedCityIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCost, setSelectedCost] = useState("All");

  // Add Stop Modal State
  const [selectedCityForStop, setSelectedCityForStop] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [stopSubmitting, setStopSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Fetch Saved Destinations
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await savedDestinationService.getSavedDestinations();
        if (res.success && Array.isArray(res.savedIds)) {
          setSavedCityIds(res.savedIds);
        }
      } catch (err) {
        console.error("[Fetch Saved Destinations Error]:", err);
      }
    };
    fetchSaved();
  }, []);

  // Fetch Cities from MySQL database with debounced search
  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        setLoading(true);
        let res;
        if (searchTerm.trim()) {
          res = await cityService.searchCities(searchTerm.trim());
        } else {
          const params = {};
          if (selectedRegion !== "All") params.region = selectedRegion;
          if (selectedCost !== "All") params.cost_index = selectedCost;
          res = await cityService.getCities(params);
        }

        if (res.success && Array.isArray(res.cities)) {
          let filtered = res.cities;
          if (selectedRegion !== "All") {
            filtered = filtered.filter((c) => c.region === selectedRegion);
          }
          if (selectedCost !== "All") {
            filtered = filtered.filter((c) => (c.cost_index || c.costIndex) === selectedCost);
          }
          setCities(filtered);
        }
      } catch (err) {
        console.error("[City Search Error]:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, selectedRegion, selectedCost]);

  // Toggle Save Destination
  const handleToggleSave = async (city) => {
    const isCurrentlySaved = savedCityIds.includes(city.id);
    try {
      if (isCurrentlySaved) {
        await savedDestinationService.removeSavedDestination(city.id);
        setSavedCityIds((prev) => prev.filter((id) => id !== city.id));
        setToastMessage(`Removed ${city.city_name || city.name} from saved list.`);
      } else {
        await savedDestinationService.saveDestination(city.id);
        setSavedCityIds((prev) => [...prev, city.id]);
        setToastMessage(`Saved ${city.city_name || city.name} to your profile! ❤️`);
      }
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("[Toggle Save Error]:", err);
    }
  };

  // Open Add Stop Modal
  const handleOpenAddModal = async (city) => {
    setSelectedCityForStop(city);
    setModalError("");
    try {
      const res = await tripService.getTrips();
      if (res.success && Array.isArray(res.trips)) {
        setUserTrips(res.trips);
        if (res.trips.length > 0) {
          const firstTrip = res.trips[0];
          setSelectedTripId(firstTrip.id);
          setArrivalDate(firstTrip.start_date || "");
          setDepartureDate(firstTrip.end_date || "");
        }
      }
    } catch (err) {
      console.error("[Fetch Trips Error]:", err);
    }
  };

  const handleTripChange = (e) => {
    const tId = e.target.value;
    setSelectedTripId(tId);
    const chosenTrip = userTrips.find((t) => String(t.id) === String(tId));
    if (chosenTrip) {
      setArrivalDate(chosenTrip.start_date || "");
      setDepartureDate(chosenTrip.end_date || "");
    }
  };

  // Submit Add Stop to Trip in MySQL
  const handleAddStopSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!selectedTripId) {
      setModalError("Please select a trip first.");
      return;
    }

    if (!arrivalDate || !departureDate) {
      setModalError("Both arrival date and departure date are required.");
      return;
    }

    if (new Date(departureDate) < new Date(arrivalDate)) {
      setModalError("Departure date cannot be before arrival date.");
      return;
    }

    try {
      setStopSubmitting(true);
      const res = await tripStopService.addStop(selectedTripId, {
        city_id: selectedCityForStop.id,
        arrival_date: arrivalDate,
        departure_date: departureDate
      });

      if (res.success) {
        setToastMessage(`Added ${selectedCityForStop.city_name || selectedCityForStop.name} to your trip! ✈️`);
        setSelectedCityForStop(null);
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch (err) {
      console.error("[Add Stop Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to add city stop. Check trip dates.";
      setModalError(apiMsg);
    } finally {
      setStopSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 py-2">
      <PageHeader
        title="Explore Destinations 🌎"
        subtitle="Discover destinations from your database, filter by cost index, save favorites, and add cities to your trip itineraries."
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

      {/* Prominent Full-Width Search & Filter Toolbar */}
      <div className="gt-glass-card p-4 p-md-4.5 mb-5 shadow-lg border-0">
        {/* Full Width Search Input */}
        <div className="position-relative mb-4">
          <i className="bi bi-search position-absolute text-saas-gradient ms-4 top-50 translate-middle-y fs-5"></i>
          <input
            type="text"
            className="form-control form-control-lg rounded-pill ps-5 pe-5 bg-dark border border-white border-opacity-15 text-white font-heading shadow-sm"
            style={{ paddingLeft: "3.5rem", height: "54px", fontSize: "1rem" }}
            placeholder="Search cities by name or country..."
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
              {cities.length} {cities.length === 1 ? "City" : "Cities"}
            </span>
          )}
        </div>

        {/* Region Chips line (Even Spacing Alignment) */}
        <div className="d-flex align-items-center flex-wrap gap-3.5 pt-3 border-top border-white border-opacity-10">
          <span className="text-white-50 small font-heading fw-semibold me-1">
            <i className="bi bi-funnel-fill me-1.5 text-saas-gradient"></i> Filter Region:
          </span>

          <div className="d-flex align-items-center gap-3 flex-wrap font-heading">
            {["All", "Europe", "Asia", "Middle East", "North America", "Oceania"].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`btn btn-sm rounded-pill px-4 py-2 text-nowrap transition-all ${
                  selectedRegion === r ? "bg-saas-gradient text-white fw-bold shadow-sm" : "btn-gt-outline text-white-50"
                }`}
              >
                {r === "All" ? "All Regions" : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cities Grid with Spacious Layout */}
      {loading ? (
        <Loading message="Loading global destinations from database..." />
      ) : cities.length > 0 ? (
        <div className="row g-4 g-xl-5">
          {cities.map((city) => (
            <div key={city.id} className="col-md-6 col-lg-4">
              <DestinationCard
                city={city}
                onAdd={handleOpenAddModal}
                isSaved={savedCityIds.includes(city.id)}
                onToggleSave={handleToggleSave}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No destinations found 🌎"
          description="Try adjusting your search query or region filter."
        />
      )}

      {/* Add City Stop Modal */}
      {selectedCityForStop && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(7,11,26,0.85)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content gt-glass-card border border-white border-opacity-20 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom border-white border-opacity-10 text-white">
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt text-saas-gradient"></i>
                  Add {selectedCityForStop.city_name || selectedCityForStop.name} to Trip
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCityForStop(null)}></button>
              </div>

              <form onSubmit={handleAddStopSubmit}>
                <div className="modal-body p-4">
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
                        <label className="form-label text-white fw-semibold font-heading">Choose Trip</label>
                        <select className="form-select bg-dark text-white border-white border-opacity-20" value={selectedTripId} onChange={handleTripChange}>
                          {userTrips.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.trip_name || t.name} ({t.start_date} – {t.end_date})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dates */}
                      <div className="row g-3">
                        <div className="col-6">
                          <label className="form-label text-white fw-semibold small font-heading">Arrival Date</label>
                          <input
                            type="date"
                            className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-white fw-semibold small font-heading">Departure Date</label>
                          <input
                            type="date"
                            className="form-control form-control-sm bg-dark text-white border-white border-opacity-20"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-white-50 small mb-3 font-heading">You don't have any trips created yet.</p>
                      <button
                        type="button"
                        className="btn btn-gt-primary btn-sm px-4 fw-bold font-heading"
                        onClick={() => {
                          setSelectedCityForStop(null);
                          navigate("/create-trip");
                        }}
                      >
                        Create Trip First
                      </button>
                    </div>
                  )}
                </div>

                {userTrips.length > 0 && (
                  <div className="modal-footer border-top border-white border-opacity-10">
                    <button type="button" className="btn btn-gt-outline btn-sm font-heading" onClick={() => setSelectedCityForStop(null)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={stopSubmitting} className="btn btn-gt-primary btn-sm px-4 fw-bold font-heading">
                      {stopSubmitting ? "Adding Stop..." : "Add City Stop"}
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

export default CitySearch;
