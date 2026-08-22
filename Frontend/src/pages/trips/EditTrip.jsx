import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import tripService from "../../services/tripService";

const PRESET_COVERS = [
  { name: "Paris & Europe", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
  { name: "Tokyo & Japan", url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" },
  { name: "Tropical Island", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { name: "Alpine Mountains", url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80" },
  { name: "New York City", url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" },
  { name: "Dubai Desert", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" }
];

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trip_name: "",
    description: "",
    start_date: "",
    end_date: "",
    cover_image: PRESET_COVERS[0].url
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setInitialLoading(true);
        const res = await tripService.getTrip(id);

        if (res.success && res.trip) {
          const t = res.trip;
          setFormData({
            trip_name: t.trip_name || "",
            description: t.description || "",
            start_date: t.start_date || "",
            end_date: t.end_date || "",
            cover_image: t.cover_image || PRESET_COVERS[0].url
          });
        }
      } catch (err) {
        console.error("[Edit Trip Fetch Error]:", err);
        setError("Unable to load trip details for editing.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSelectPreset = (url) => {
    setFormData((prev) => ({ ...prev, cover_image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Field Validation
    if (!formData.trip_name.trim()) {
      setError("Trip name is required.");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setError("Both start date and end date are required.");
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        trip_name: formData.trip_name.trim(),
        description: formData.description.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        cover_image: formData.cover_image
      };

      const res = await tripService.updateTrip(id, payload);

      setSuccessMessage(res.message || "Trip updated successfully!");

      setTimeout(() => {
        navigate("/my-trips");
      }, 1000);
    } catch (err) {
      console.error("[Update Trip Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to update trip. Please try again.";
      setError(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return <Loading message="Loading trip details..." />;
  }

  return (
    <div>
      <PageHeader
        title="Edit Trip"
        subtitle={`Update trip details for "${formData.trip_name || "Your Trip"}"`}
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Edit Trip" }]}
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
        {/* Left Column: Cover Preview & Presets */}
        <div className="col-lg-5">
          <div className="gt-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="font-heading fw-bold text-navy-deep mb-3">Cover Image</h5>

              <div className="position-relative rounded-4 overflow-hidden shadow-sm mb-4" style={{ height: "220px" }}>
                <img
                  src={formData.cover_image}
                  alt="Trip Cover Preview"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(7,26,43,0.85))" }}
                ></div>
                <div className="position-absolute bottom-0 start-0 m-3 text-white">
                  <span className="badge bg-ocean-gradient text-white fw-bold mb-1">Active Cover</span>
                  <h5 className="font-heading fw-bold text-white mb-0">{formData.trip_name || "Trip Name"}</h5>
                </div>
              </div>

              <label className="form-label text-navy-deep fw-semibold small mb-2">Change Preset Cover</label>
              <div className="row g-2">
                {PRESET_COVERS.map((preset, idx) => (
                  <div key={idx} className="col-4">
                    <button
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`btn p-0 w-100 rounded-3 overflow-hidden border border-2 transition-all ${
                        formData.cover_image === preset.url ? "border-primary shadow" : "border-transparent opacity-75"
                      }`}
                      style={{ height: "60px" }}
                    >
                      <img src={preset.url} alt={preset.name} className="w-100 h-100" style={{ objectFit: "cover" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="col-lg-7">
          <div className="gt-card p-4 p-md-5">
            <div className="mb-4">
              <h3 className="font-heading fw-extrabold text-navy-deep mb-1">Edit Your Trip</h3>
              <p className="text-muted small">Update your itinerary title, description, or dates.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label className="form-label text-navy-deep fw-semibold">
                  Trip Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="trip_name"
                  className="form-control form-control-lg bg-light border-0 shadow-none"
                  value={formData.trip_name}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <div className="mb-4">
                <label className="form-label text-navy-deep fw-semibold">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  className="form-control bg-light border-0 shadow-none"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top">
                <Link to="/my-trips" className="btn btn-gt-outline px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gt-primary px-4 py-2.5 font-heading fw-bold d-flex align-items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-1"></i>
                      <span>Save Changes</span>
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

export default EditTrip;
