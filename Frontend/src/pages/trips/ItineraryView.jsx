import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import tripService from "../../services/tripService";
import { formatDateRange, calculateTripDays, getTripStatus } from "../../utils/dateUtils";

const ItineraryView = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await tripService.getTrip(tripId);
        if (res.success && res.trip) {
          setTrip(res.trip);
        } else {
          setError("Trip not found.");
        }
      } catch (err) {
        console.error("[View Trip Error]:", err);
        setError("Unable to load trip overview.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return <Loading message="Loading trip overview..." />;
  }

  if (error || !trip) {
    return (
      <div className="gt-card p-5 text-center my-4">
        <div className="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-circle mx-auto mb-3" style={{ width: "64px", height: "64px" }}>
          <i className="bi bi-exclamation-circle fs-2"></i>
        </div>
        <h5 className="font-heading text-navy-deep fw-bold mb-2">{error || "Trip not found."}</h5>
        <p className="text-muted small mb-4">The trip you requested does not exist or has been deleted.</p>
        <Link to="/my-trips" className="btn btn-gt-primary px-4">
          Back to My Trips
        </Link>
      </div>
    );
  }

  const startDate = trip.start_date || trip.startDate;
  const endDate = trip.end_date || trip.endDate;
  const name = trip.trip_name || trip.name;
  const coverImage = trip.cover_image || trip.coverImage || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";

  const status = getTripStatus(startDate, endDate);
  const daysCount = calculateTripDays(startDate, endDate);
  const dateFormatted = formatDateRange(startDate, endDate);

  return (
    <div>
      <PageHeader
        title={name}
        subtitle="Basic Trip Overview"
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Trip Overview" }]}
        action={
          <Link to={`/trips/${trip.id}/edit`} className="btn btn-gt-outline fw-semibold d-flex align-items-center gap-2">
            <i className="bi bi-pencil"></i>
            <span>Edit Trip</span>
          </Link>
        }
      />

      {/* Hero Banner Card */}
      <div
        className="gt-card p-4 p-md-5 text-white mb-4 rounded-4 position-relative overflow-hidden shadow-lg border-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(7,26,43,0.9), rgba(7,26,43,0.55)), url(${coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="position-relative z-1">
          <span className="badge bg-ocean-gradient text-white fw-bold px-3 py-2 rounded-pill mb-3">
            {status}
          </span>

          <h1 className="font-heading display-5 fw-extrabold text-white mb-2">{name}</h1>

          <p className="text-white-50 lead fs-6 max-w-2xl mb-4">
            {trip.description || "No description provided for this trip."}
          </p>

          <div className="d-flex flex-wrap align-items-center gap-4 pt-3 border-top border-white border-opacity-25">
            <div className="d-flex align-items-center gap-2 text-aqua fw-semibold">
              <i className="bi bi-calendar-event fs-5"></i>
              <span>{dateFormatted}</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-aqua fw-semibold">
              <i className="bi bi-clock-history fs-5"></i>
              <span>{daysCount} {daysCount === 1 ? "Day" : "Days"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Information Card */}
      <div className="gt-card p-4 p-md-5">
        <h4 className="font-heading fw-bold text-navy-deep mb-3">Trip Overview</h4>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="p-3 bg-light rounded-3 border">
              <span className="text-muted fs-7 d-block">Trip Name</span>
              <span className="fw-bold text-navy-deep fs-6">{name}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 bg-light rounded-3 border">
              <span className="text-muted fs-7 d-block">Scheduled Dates</span>
              <span className="fw-bold text-navy-deep fs-6">{dateFormatted} ({daysCount} days)</span>
            </div>
          </div>
          <div className="col-12">
            <div className="p-3 bg-light rounded-3 border">
              <span className="text-muted fs-7 d-block">Description</span>
              <p className="mb-0 text-navy-deep mt-1">{trip.description || "No notes added yet."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
