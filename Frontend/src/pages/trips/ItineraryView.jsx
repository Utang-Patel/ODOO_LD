import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Timeline from "../../components/Timeline";
import ItineraryDay from "../../components/ItineraryDay";
import { DUMMY_TRIPS } from "../../data/dummyData";

const ItineraryView = () => {
  const { tripId } = useParams();
  const trip = DUMMY_TRIPS.find((t) => t.id === tripId) || DUMMY_TRIPS[0];
  const [viewMode, setViewMode] = useState("list");

  return (
    <div>
      <PageHeader
        title={`${trip.name} — Full Itinerary View`}
        subtitle={`${trip.startDate} → ${trip.endDate} • ${trip.citiesCount} Cities • ${trip.daysCount} Days`}
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Itinerary View" }]}
        action={
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-sm ${viewMode === "list" ? "btn-gt-primary" : "btn-gt-outline"}`}
                onClick={() => setViewMode("list")}
              >
                <i className="bi bi-list-task me-1"></i> List View
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === "timeline" ? "btn-gt-primary" : "btn-gt-outline"}`}
                onClick={() => setViewMode("timeline")}
              >
                <i className="bi bi-diagram-2 me-1"></i> Timeline View
              </button>
            </div>
            <Link to={`/itinerary/${trip.id}`} className="btn btn-gt-outline btn-sm">
              <i className="bi bi-pencil me-1"></i> Edit
            </Link>
          </div>
        }
      />

      {/* Main Cover Banner */}
      <div
        className="gt-card p-4 text-white mb-4 position-relative overflow-hidden"
        style={{
          height: "220px",
          backgroundImage: `linear-gradient(to right, rgba(7,26,43,0.85), rgba(7,26,43,0.4)), url(${trip.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="position-relative z-1 h-100 d-flex flex-column justify-content-between">
          <div>
            <span className="badge bg-sunset-gradient text-navy-deep fw-bold px-3 py-2 rounded-pill mb-2">
              {trip.status}
            </span>
            <h2 className="font-heading display-6 fw-extrabold text-white mb-1">{trip.name}</h2>
            <p className="text-white-50 mb-0">{trip.description}</p>
          </div>
          <div className="d-flex align-items-center gap-4 text-aqua font-heading fw-bold">
            <span><i className="bi bi-geo-alt me-1"></i> {trip.citiesCount} Cities</span>
            <span><i className="bi bi-calendar3 me-1"></i> {trip.daysCount} Days</span>
            <span><i className="bi bi-wallet2 me-1"></i> ₹{trip.estimatedBudget?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* View Mode Switching Content */}
      {viewMode === "list" ? (
        <div className="d-flex flex-column gap-3">
          {trip.stops.map((stop, idx) => (
            <ItineraryDay
              key={stop.id}
              dayNumber={idx + 1}
              date={`${stop.startDate} - ${stop.endDate}`}
              city={stop.cityName}
              flag={stop.flag}
              activities={stop.activities}
            />
          ))}
        </div>
      ) : (
        <div className="gt-card p-4">
          <h5 className="font-heading fw-bold text-navy-deep mb-3">Interactive Visual Timeline</h5>
          <Timeline stops={trip.stops} />
        </div>
      )}
    </div>
  );
};

export default ItineraryView;
