import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import TripCard from "../../components/TripCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import ShareTripModal from "../../components/ShareTripModal";
import tripService from "../../services/tripService";
import { getTripStatus } from "../../utils/dateUtils";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Delete modal state
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Share modal state
  const [tripToShare, setTripToShare] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await tripService.getTrips();
      if (res.success && Array.isArray(res.trips)) {
        setTrips(res.trips);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error("[Fetch Trips Error]:", err);
      setError("Unable to load your trips from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleOpenDeleteModal = (trip) => {
    setTripToDelete(trip);
  };

  const handleOpenShareModal = (trip) => {
    setTripToShare(trip);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      setDeleting(true);
      await tripService.deleteTrip(tripToDelete.id);
      setTrips((prev) => prev.filter((t) => t.id !== tripToDelete.id));
      setToastMessage("Trip deleted successfully.");
      setToastType("success");
      setTripToDelete(null);
    } catch (err) {
      console.error("[Delete Trip Error]:", err);
      setToastMessage("Unable to delete this trip. Please try again.");
      setToastType("danger");
    } finally {
      setDeleting(false);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleTripUpdated = (updatedTrip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? { ...t, ...updatedTrip } : t)));
  };

  // Filter & Search Logic
  const filteredTrips = trips.filter((t) => {
    const nameStr = (t.trip_name || t.name || "").toLowerCase();
    const matchesSearch = nameStr.includes(searchTerm.toLowerCase().trim());

    const tripStatus = getTripStatus(t.start_date || t.startDate, t.end_date || t.endDate);
    const matchesStatus = statusFilter === "All" || tripStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="d-flex flex-column gap-4 py-2">
      <PageHeader
        title="My Trips ✈️"
        subtitle="Real multi-city journeys and travel itineraries stored in your database."
        action={
          <Link to="/create-trip" className="btn btn-gt-primary font-heading fw-bold d-flex align-items-center gap-2 px-4 py-2.5">
            <i className="bi bi-plus-circle-fill fs-5"></i>
            <span>Plan New Trip</span>
          </Link>
        }
      />

      {/* Toast Alert Notifications */}
      {toastMessage && (
        <div className={`alert alert-${toastType} alert-dismissible fade show rounded-3 shadow-sm mb-4`} role="alert">
          <i className={`bi ${toastType === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
          {toastMessage}
          <button type="button" className="btn-close" onClick={() => setToastMessage("")}></button>
        </div>
      )}

      {/* Filter & Search Toolbar with Clean Spacing */}
      <div className="gt-glass-card p-4 mb-4 d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3">
        {/* Search Bar */}
        <div className="position-relative flex-grow-1" style={{ maxWidth: "420px" }}>
          <i className="bi bi-search position-absolute text-muted ms-3 top-50 translate-middle-y"></i>
          <input
            type="text"
            className="form-control form-control-lg rounded-pill ps-5 bg-dark border-0 shadow-none text-white small"
            placeholder="Search your trips by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-sm btn-link text-muted position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-decoration-none"
            >
              <i className="bi bi-x-circle-fill fs-5"></i>
            </button>
          )}
        </div>

        {/* Status Filter Badges */}
        <div className="d-flex align-items-center gap-2 overflow-auto py-1 font-heading">
          {["All", "Upcoming", "Ongoing", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold text-nowrap transition-all ${
                statusFilter === status
                  ? "bg-saas-gradient text-white shadow-sm fw-bold"
                  : "btn-gt-outline text-white-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content States */}
      {loading ? (
        <Loading message="Fetching your real trips from database..." />
      ) : error ? (
        <div className="gt-glass-card p-5 text-center my-4">
          <div className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mx-auto mb-3" style={{ width: "64px", height: "64px" }}>
            <i className="bi bi-exclamation-triangle fs-2"></i>
          </div>
          <h5 className="font-heading text-white fw-bold mb-2">{error}</h5>
          <p className="text-white-50 small mb-4 font-heading">Check your backend connection and try again.</p>
          <button onClick={fetchTrips} className="btn btn-gt-primary px-4 py-2 font-heading fw-bold">
            <i className="bi bi-arrow-clockwise me-1"></i> Try Again
          </button>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="row g-4 g-xl-5">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="col-md-6 col-lg-4">
              <TripCard
                trip={trip}
                onDelete={handleOpenDeleteModal}
                onShare={handleOpenShareModal}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchTerm || statusFilter !== "All" ? "No matching trips found" : "No trips planned yet ✈️"}
          description={searchTerm || statusFilter !== "All" ? "Try adjusting your search query or status filter." : "Your next adventure is waiting. Plan your first trip now."}
          actionLabel="Plan New Trip"
          actionPath="/create-trip"
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(tripToDelete)}
        title="Delete this trip?"
        message={`Are you sure you want to delete "${tripToDelete?.trip_name || "this trip"}"? This action cannot be undone.`}
        confirmText="Delete Trip"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setTripToDelete(null)}
      />

      {/* Share Trip Modal */}
      {tripToShare && (
        <ShareTripModal
          trip={tripToShare}
          onClose={() => setTripToShare(null)}
          onTripUpdate={handleTripUpdated}
        />
      )}
    </div>
  );
};

export default MyTrips;
