import React, { useState, useEffect } from "react";
import shareService from "../services/shareService";

const ShareTripModal = ({ trip, onClose, onTripUpdate }) => {
  const [isPublic, setIsPublic] = useState(trip?.is_public || false);
  const [shareToken, setShareToken] = useState(trip?.share_token || "");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const publicUrl = shareToken
    ? `${window.location.origin}/shared/${shareToken}`
    : "";

  const handleToggleShare = async () => {
    try {
      setLoading(true);
      setError("");

      if (isPublic) {
        const res = await shareService.unshareTrip(trip.id);
        if (res.success) {
          setIsPublic(false);
          setShareToken("");
          if (onTripUpdate) onTripUpdate({ ...trip, is_public: false, share_token: null });
        }
      } else {
        const res = await shareService.shareTrip(trip.id);
        if (res.success) {
          setIsPublic(true);
          setShareToken(res.share_token);
          if (onTripUpdate) onTripUpdate({ ...trip, is_public: true, share_token: res.share_token });
        }
      }
    } catch (err) {
      console.error("[Share Toggle Error]:", err);
      setError("Unable to update trip sharing settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share && publicUrl) {
      navigator.share({
        title: trip.trip_name || trip.name,
        text: `Check out my travel itinerary for ${trip.trip_name || trip.name} on GlobeTrotter! ✈️`,
        url: publicUrl
      }).catch(() => {});
    }
  };

  const encodedUrl = encodeURIComponent(publicUrl);
  const encodedText = encodeURIComponent(`Check out my GlobeTrotter itinerary for ${trip.trip_name || trip.name}! ✈️`);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content gt-card border-0 shadow-lg overflow-hidden">
          <div className="modal-header bg-navy-deep text-white">
            <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-share text-aqua"></i> Share Your Adventure 🌎
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger small p-2 mb-3 rounded-3">
                <i className="bi bi-exclamation-circle me-1"></i> {error}
              </div>
            )}

            {/* Trip Info Header */}
            <div className="p-3 bg-light rounded-3 mb-4 border d-flex align-items-center justify-content-between">
              <div>
                <h6 className="fw-extrabold text-navy-deep mb-0">{trip.trip_name || trip.name}</h6>
                <span className="text-muted small">{trip.start_date} – {trip.end_date}</span>
              </div>
              <span className={`badge ${isPublic ? "bg-success" : "bg-secondary"} px-3 py-1.5 rounded-pill fw-bold`}>
                {isPublic ? "Public 🌐" : "Private 🔒"}
              </span>
            </div>

            {/* Privacy Toggle Section */}
            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border mb-4">
              <div>
                <span className="fw-semibold text-navy-deep d-block">Public Link Sharing</span>
                <span className="text-muted small">Anyone with the link can view your read-only itinerary.</span>
              </div>
              <button
                type="button"
                onClick={handleToggleShare}
                disabled={loading}
                className={`btn btn-sm ${isPublic ? "btn-outline-danger" : "btn-gt-primary"} fw-bold px-3`}
              >
                {loading ? "Updating..." : isPublic ? "Make Private" : "Make Public"}
              </button>
            </div>

            {/* Public Link Input & Copy */}
            {isPublic && (
              <div className="mb-4">
                <label className="form-label text-navy-deep fw-semibold small">Public Share URL</label>
                <div className="input-group">
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm bg-light"
                    value={publicUrl}
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`btn btn-sm ${copied ? "btn-success" : "btn-gt-primary"} px-3 fw-bold`}
                  >
                    <i className={`bi ${copied ? "bi-check2" : "bi-clipboard"} me-1`}></i>
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            )}

            {/* Social Share Buttons */}
            {isPublic && (
              <div>
                <label className="form-label text-navy-deep fw-semibold small d-block mb-2">Share to Socials</label>
                <div className="d-flex flex-wrap gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-success d-flex align-items-center gap-1.5 px-3 rounded-pill fw-semibold"
                  >
                    <i className="bi bi-whatsapp"></i> WhatsApp
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1.5 px-3 rounded-pill fw-semibold"
                  >
                    <i className="bi bi-facebook"></i> Facebook
                  </a>
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1.5 px-3 rounded-pill fw-semibold"
                  >
                    <i className="bi bi-twitter-x"></i> X (Twitter)
                  </a>

                  {navigator.share && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="btn btn-sm btn-gt-outline d-flex align-items-center gap-1.5 px-3 rounded-pill fw-semibold"
                    >
                      <i className="bi bi-share-fill"></i> Native Share
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light border-top">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTripModal;
