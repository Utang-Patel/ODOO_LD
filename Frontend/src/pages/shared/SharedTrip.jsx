import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Timeline from "../../components/Timeline";
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
    <div className="min-vh-100 bg-cloud-bg py-5">
      <div className="container max-w-5xl">
        {/* Read-Only Public Header Banner */}
        <div
          className="gt-card p-4 p-md-5 text-white mb-4 rounded-4 position-relative overflow-hidden shadow-lg"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(7,26,43,0.9), rgba(7,26,43,0.5)), url(${trip.coverImage})`,
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
                <button onClick={handleCopyLink} className="btn btn-gt-primary btn-sm px-3">
                  <i className={`bi ${copied ? "bi-check2" : "bi-link-45deg"} me-1`}></i>
                  {copied ? "Link Copied!" : "Share Trip"}
                </button>
                <button className="btn btn-outline-light btn-sm px-3">
                  <i className="bi bi-files me-1"></i> Copy to My Trips
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Timeline Content */}
        <div className="gt-card p-4 p-md-5">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
            <h4 className="font-heading fw-bold text-navy-deep mb-0">Itinerary Route Breakdown</h4>
            <span className="text-muted fs-7">Read-Only View</span>
          </div>

          <Timeline stops={trip.stops} />
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;
