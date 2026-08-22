import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { DUMMY_TRIPS } from "../../data/dummyData";

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const trip = DUMMY_TRIPS.find((t) => t.id === tripId) || DUMMY_TRIPS[0];
  const [stops, setStops] = useState(trip.stops);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <PageHeader
        title={`${trip.name} — Itinerary Builder`}
        subtitle={`${trip.startDate} → ${trip.endDate} • ${trip.daysCount} Days • ${stops.length} Cities`}
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Itinerary Builder" }]}
        action={
          <div className="d-flex gap-2">
            <Link to={`/itinerary/${trip.id}/view`} className="btn btn-gt-outline btn-sm">
              <i className="bi bi-eye me-1"></i> Preview Itinerary
            </Link>
            <button onClick={handleSave} className="btn btn-gt-primary btn-sm">
              <i className="bi bi-floppy me-1"></i> Save Itinerary
            </button>
          </div>
        }
      />

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>Itinerary changes saved successfully!</span>
        </div>
      )}

      {/* Multi-city stops list */}
      <div className="d-flex flex-column gap-4">
        {stops.map((stop, index) => (
          <div key={stop.id} className="gt-card p-4">
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <span className="fs-3">{stop.flag}</span>
                <div>
                  <h4 className="font-heading fw-extrabold text-navy-deep mb-0">
                    STOP {index + 1}: {stop.cityName.toUpperCase()}, {stop.country.toUpperCase()}
                  </h4>
                  <span className="text-muted small">
                    {stop.startDate} – {stop.endDate}
                  </span>
                </div>
              </div>

              <button className="btn btn-outline-danger btn-sm rounded-pill px-3">
                <i className="bi bi-trash me-1"></i> Remove Stop
              </button>
            </div>

            {/* Stop Activities */}
            <div className="d-flex flex-column gap-2 mb-3">
              {stop.activities && stop.activities.length > 0 ? (
                stop.activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-white text-navy-deep border fw-bold px-2 py-1">
                        {act.time}
                      </span>
                      <div>
                        <h6 className="mb-0 font-heading fw-semibold text-navy-deep">{act.name}</h6>
                        <span className="text-muted fs-7">{act.category}</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-bold text-ocean-blue">
                        {act.cost > 0 ? `₹${act.cost}` : "Free"}
                      </span>
                      <button className="btn btn-link text-muted p-0">
                        <i className="bi bi-x-circle fs-5"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 bg-light rounded-3">
                  <p className="text-muted small mb-0">No activities added yet for this stop.</p>
                </div>
              )}
            </div>

            <Link
              to={`/activities/${stop.cityName.toLowerCase()}`}
              className="btn btn-gt-outline btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-plus-circle"></i>
              <span>Add Activity to {stop.cityName}</span>
            </Link>
          </div>
        ))}

        {/* Add City Stop Action Banner */}
        <div className="gt-card p-4 text-center border-dashed">
          <h5 className="font-heading fw-bold text-navy-deep mb-2">Need to add another destination?</h5>
          <p className="text-muted small mb-3">Expand your travel route with multi-city stops across Europe, Asia, or America.</p>
          <Link to="/cities" className="btn btn-gt-primary px-4 py-2">
            <i className="bi bi-plus-circle me-1"></i> Add City Stop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
