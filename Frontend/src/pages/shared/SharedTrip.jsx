import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Timeline from "../../components/Timeline";
import PageHeader from "../../components/PageHeader";
import { DUMMY_TRIPS } from "../../data/dummyData";

const SharedTrip = () => {
  const { tripId } = useParams();
  const trip = DUMMY_TRIPS.find((t) => t.id === tripId) || DUMMY_TRIPS[0];
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title={`${trip.name} — Shared Public Itinerary`}
        subtitle="Read-only view of multi-city stops, activity schedules, and travel routes."
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Shared Trip" }]}
        action={
          <div className="d-flex gap-2">
            <button onClick={handleCopyLink} className="btn btn-gt-primary btn-sm px-3 fw-semibold">
              <i className={`bi ${copied ? "bi-check2" : "bi-link-45deg"} me-1`}></i>
              {copied ? "Link Copied!" : "Share Trip"}
            </button>
            <Link to="/create-trip" className="btn btn-gt-outline btn-sm px-3 fw-semibold">
              <i className="bi bi-files me-1"></i> Copy to My Trips
            </Link>
          </div>
        }
      />

      {/* Public Read-Only Hero Banner */}
      <div
        className="gt-card p-4 p-md-5 text-white mb-4 rounded-4 position-relative overflow-hidden shadow-lg border-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(7,26,43,0.92), rgba(7,26,43,0.55)), url(${trip.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="position-relative z-1">
          <span className="badge bg-sunset-gradient text-navy-deep fw-bold px-3 py-2 rounded-pill mb-3">
            🌍 Shared Public Itinerary
          </span>
          <h1 className="font-heading display-5 fw-extrabold text-white mb-2">{trip.name}</h1>
          <p className="text-white-50 lead fs-6 mb-4">{trip.description}</p>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top border-white border-opacity-25">
            <div className="d-flex gap-3 text-aqua fw-bold font-heading">
              <span>🇫🇷 Paris</span>
              <span>•</span>
              <span>🇨🇭 Zurich</span>
              <span>•</span>
              <span>🇮🇹 Rome</span>
            </div>

            <div className="d-flex gap-2">
              <button onClick={handleCopyLink} className="btn btn-gt-primary btn-sm px-3 fw-semibold">
                <i className={`bi ${copied ? "bi-check2" : "bi-link-45deg"} me-1`}></i>
                {copied ? "Link Copied!" : "Share Trip"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Read-Only Timeline Content */}
      <div className="gt-card p-4 p-md-5">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <h4 className="font-heading fw-bold text-navy-deep mb-0">Itinerary Route Breakdown</h4>
          <span className="badge bg-light text-muted border px-3 py-2">Read-Only View</span>
        </div>

        <Timeline stops={trip.stops} />
      </div>
    </div>
  );
};

export default SharedTrip;
