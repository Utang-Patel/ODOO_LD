import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import tripService from "../../services/tripService";
import tripStopService from "../../services/tripStopService";
import itineraryService from "../../services/itineraryService";
import { formatDateRange, calculateTripDays, getTripStatus } from "../../utils/dateUtils";

const ItineraryView = () => {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTripOverview = async () => {
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
        console.error("[View Itinerary Error]:", err);
        setError("Unable to load itinerary overview.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripOverview();
  }, [tripId]);

  if (loading) {
    return <Loading message="Loading itinerary overview..." />;
  }

  if (error || !trip) {
    return (
      <div className="gt-card p-5 text-center my-4">
        <h5 className="font-heading text-navy-deep fw-bold mb-2">{error || "Trip not found"}</h5>
        <Link to="/my-trips" className="btn btn-gt-primary px-4">Back to My Trips</Link>
      </div>
    );
  }

  const dateFormatted = formatDateRange(trip.start_date, trip.end_date);
  const totalDays = calculateTripDays(trip.start_date, trip.end_date);
  const status = getTripStatus(trip.start_date, trip.end_date);

  return (
    <div>
      <PageHeader
        title={`${trip.trip_name || trip.name} — Itinerary Overview`}
        subtitle="Read-only view of multi-city stops and scheduled activity timelines."
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Itinerary Preview" }]}
        action={
          <div className="d-flex gap-2">
            <Link to={`/itinerary/${trip.id}`} className="btn btn-gt-primary btn-sm fw-bold">
              <i className="bi bi-pencil-square me-1"></i> Edit Itinerary
            </Link>
          </div>
        }
      />

      {/* Hero Banner Card */}
      <div
        className="gt-card p-4 p-md-5 text-white mb-4 rounded-4 position-relative overflow-hidden shadow-lg border-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(7,26,43,0.92), rgba(7,26,43,0.55)), url(${trip.cover_image || trip.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="position-relative z-1">
          <span className="badge bg-ocean-gradient text-white fw-bold px-3 py-2 rounded-pill mb-3">
            {status}
          </span>

          <h1 className="font-heading display-5 fw-extrabold text-white mb-2">{trip.trip_name || trip.name}</h1>

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
              <span>{totalDays} {totalDays === 1 ? "Day" : "Days"}</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-aqua fw-semibold">
              <i className="bi bi-geo-alt fs-5"></i>
              <span>{stops.length} {stops.length === 1 ? "City Stop" : "City Stops"}</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-aqua fw-semibold">
              <i className="bi bi-ticket-perforated fs-5"></i>
              <span>{itineraryItems.length} {itineraryItems.length === 1 ? "Activity" : "Activities"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-city stops & activity overview */}
      {stops.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {stops.map((stop, idx) => {
            const cityName = stop.city?.city_name || "City";
            const countryName = stop.city?.country || "";
            const stopItems = itineraryItems.filter((i) => String(i.trip_stop_id) === String(stop.id));

            return (
              <div key={stop.id} className="gt-card p-4 p-md-5">
                <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
                  <span className="badge bg-navy-deep text-aqua fs-6 p-2 rounded-3 fw-bold">
                    STOP {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-heading fw-extrabold text-navy-deep mb-0">
                      {cityName}, {countryName}
                    </h4>
                    <span className="text-muted small">
                      {formatDateRange(stop.arrival_date, stop.departure_date)}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2">
                  {stopItems.length > 0 ? (
                    stopItems.map((item) => (
                      <div key={item.id} className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <span className="badge bg-white text-navy-deep border fw-bold px-2 py-1">
                            {item.start_time} – {item.end_time}
                          </span>
                          <div>
                            <h6 className="mb-0 font-heading fw-semibold text-navy-deep">
                              {item.activity?.activity_name || item.activity?.name}
                            </h6>
                            <span className="text-muted fs-7">{item.activity?.category}</span>
                          </div>
                        </div>
                        <span className="fw-bold text-ocean-blue">
                          {parseFloat(item.activity?.cost || 0) > 0 ? `€${item.activity?.cost}` : "Free"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small mb-0 py-2">No activities scheduled yet for this city stop.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="gt-card p-5 text-center">
          <p className="text-muted mb-3">No city stops have been added to this itinerary yet.</p>
          <Link to={`/itinerary/${trip.id}`} className="btn btn-gt-primary px-4">
            + Add City Stop in Itinerary Builder
          </Link>
        </div>
      )}
    </div>
  );
};

export default ItineraryView;
