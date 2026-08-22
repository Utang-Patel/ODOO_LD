import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import tripService from "../../services/tripService";

const PRESET_COVERS = [
  { name: "Paris & Europe", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
  { name: "Tokyo & Japan", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" },
  { name: "Tropical Island", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { name: "Alpine Mountains", url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80" },
  { name: "New York City", url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" },
  { name: "Dubai Desert", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" }
];

const CreateTrip = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trip_name: "",
    description: "",
    start_date: "",
    end_date: "",
    cover_image: PRESET_COVERS[0].url,
    budget_limit: "",
    currency: "INR"
  });

  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSelectPreset = (url) => {
    setUseCustomUrl(false);
    setFormData((prev) => ({ ...prev, cover_image: url }));
  };

  const handleApplyCustomUrl = () => {
    if (customCoverUrl.trim()) {
      setFormData((prev) => ({ ...prev, cover_image: customCoverUrl.trim() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Field Validation
    if (!formData.trip_name.trim()) {
      setError("Trip name is required.");
      return;
    }

    if (!formData.start_date) {
      setError("Start date is required.");
      return;
    }

    if (!formData.end_date) {
      setError("End date is required.");
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError("End date cannot be before start date.");
      return;
    }

    if (formData.budget_limit) {
      const parsed = parseFloat(formData.budget_limit);
      if (isNaN(parsed) || parsed <= 0) {
        setError("Budget limit must be greater than zero.");
        return;
      }
    }

    try {
      setLoading(true);
      const activeCover = useCustomUrl && customCoverUrl.trim() ? customCoverUrl.trim() : formData.cover_image;

      const payload = {
        trip_name: formData.trip_name.trim(),
        description: formData.description.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        cover_image: activeCover,
        budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : null,
        currency: formData.currency || "INR"
      };

      const res = await tripService.createTrip(payload);

      setSuccessMessage(res.message || "Trip created successfully! ✈️");

      setTimeout(() => {
        navigate("/my-trips");
      }, 1200);
    } catch (err) {
      console.error("[Create Trip Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to create trip. Please check details and try again.";
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Plan New Trip"
        subtitle="Create your multi-city itinerary starting with basic trip dates & budget."
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Plan New Trip" }]}
      />

      {error && (
        <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success d-flex align-items-center rounded-3 mb-4 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill fs-5 me-2"></i>
          <div>{successMessage}</div>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Visual Cover Preview & Selection */}
        <div className="col-lg-5">
          <div className="gt-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="font-heading fw-bold text-navy-deep mb-3">Cover Image Preview</h5>

              {/* Cover Preview Card */}
              <div className="position-relative rounded-4 overflow-hidden shadow-sm mb-4" style={{ height: "240px" }}>
                <img
                  src={useCustomUrl && customCoverUrl ? customCoverUrl : formData.cover_image}
                  alt="Trip Cover Preview"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = PRESET_COVERS[0].url;
                  }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(7,26,43,0.85))" }}
                ></div>
                <div className="position-absolute bottom-0 start-0 m-3 text-white">
                  <span className="badge bg-sunset-gradient text-navy-deep fw-bold mb-1">Preview</span>
                  <h5 className="font-heading fw-bold text-white mb-0">
                    {formData.trip_name.trim() || "Your Trip Name"}
                  </h5>
                </div>
              </div>

              {/* Preset Selector */}
              <label className="form-label text-navy-deep fw-semibold small mb-2">Select Preset Cover</label>
              <div className="row g-2 mb-3">
                {PRESET_COVERS.map((preset, idx) => (
                  <div key={idx} className="col-4">
                    <button
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`btn p-0 w-100 rounded-3 overflow-hidden border border-2 transition-all ${
                        !useCustomUrl && formData.cover_image === preset.url ? "border-primary shadow" : "border-transparent opacity-75"
                      }`}
                      style={{ height: "60px" }}
                    >
                      <img src={preset.url} alt={preset.name} className="w-100 h-100" style={{ objectFit: "cover" }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Custom Image URL Option */}
              <div className="mt-3 pt-3 border-top">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="useCustomUrl"
                    checked={useCustomUrl}
                    onChange={(e) => setUseCustomUrl(e.target.checked)}
                  />
                  <label className="form-check-label text-secondary small fw-semibold" htmlFor="useCustomUrl">
                    Use Custom Image URL
                  </label>
                </div>

                {useCustomUrl && (
                  <div className="input-group">
                    <input
                      type="url"
                      className="form-control form-control-sm bg-light"
                      placeholder="https://example.com/cover.jpg"
                      value={customCoverUrl}
                      onChange={(e) => setCustomCoverUrl(e.target.value)}
                    />
                    <button type="button" className="btn btn-gt-outline btn-sm" onClick={handleApplyCustomUrl}>
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="col-lg-7">
          <div className="gt-card p-4 p-md-5">
            <div className="mb-4">
              <h3 className="font-heading fw-extrabold text-navy-deep mb-1">Create Your Adventure ✈️</h3>
              <p className="text-muted small">Plan your next journey with GlobeTrotter.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Trip Name */}
              <div className="mb-4">
                <label className="form-label text-navy-deep fw-semibold">
                  Trip Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="trip_name"
                  className={`form-control form-control-lg bg-light border-0 shadow-none ${error && !formData.trip_name ? "is-invalid" : ""}`}
                  placeholder="e.g. Europe Adventure, Tokyo Gateway..."
                  value={formData.trip_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Date Inputs Row */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-navy-deep fw-semibold">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    className="form-control form-control-lg bg-light border-0 shadow-none"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-navy-deep fw-semibold">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    className="form-control form-control-lg bg-light border-0 shadow-none"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Budget Limit & Currency Row */}
              <div className="row g-3 mb-4">
                <div className="col-md-8">
                  <label className="form-label text-navy-deep fw-semibold">
                    Budget Limit <span className="text-muted small">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    name="budget_limit"
                    className="form-control form-control-lg bg-light border-0 shadow-none"
                    placeholder="e.g. 100000"
                    value={formData.budget_limit}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-navy-deep fw-semibold">Currency</label>
                  <select
                    name="currency"
                    className="form-select form-select-lg bg-light border-0 shadow-none"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="form-label text-navy-deep fw-semibold">
                  Description <span className="text-muted small">(Optional)</span>
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Summarize your travel plans, goals, or notes..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Actions */}
              <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top">
                <Link to="/my-trips" className="btn btn-gt-outline px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gt-primary px-4 py-2.5 font-heading fw-bold d-flex align-items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Creating Trip...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle fs-5"></i>
                      <span>Create Trip</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
