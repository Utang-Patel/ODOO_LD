import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      navigate("/itinerary/trip_1");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Create Your Adventure ✈️"
        subtitle="Start by naming your trip and selecting dates for your journey."
        breadcrumbs={[{ label: "My Trips", path: "/my-trips" }, { label: "Create Trip" }]}
      />

      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 shadow-sm mb-4">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span>Trip created successfully! Redirecting to itinerary builder...</span>
        </div>
      )}

      <div className="gt-card p-4 p-md-5">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label text-navy-deep fw-bold">Trip Name *</label>
              <input
                type="text"
                className="form-control py-2.5 rounded-3"
                placeholder="e.g., European Summer Expedition 2026"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-navy-deep fw-bold">Start Date *</label>
              <input
                type="date"
                className="form-control py-2.5 rounded-3"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-navy-deep fw-bold">End Date *</label>
              <input
                type="date"
                className="form-control py-2.5 rounded-3"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label text-navy-deep fw-bold">Description</label>
              <textarea
                className="form-control rounded-3"
                rows="4"
                placeholder="Briefly describe what you want to experience on this journey..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="col-12">
              <label className="form-label text-navy-deep fw-bold">Cover Photo URL</label>
              <input
                type="url"
                className="form-control py-2.5 rounded-3 mb-3"
                placeholder="https://images.unsplash.com/..."
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />

              {formData.coverImage && (
                <div className="position-relative rounded-4 overflow-hidden border" style={{ height: "180px" }}>
                  <img
                    src={formData.coverImage}
                    alt="Cover Preview"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="position-absolute bottom-0 start-0 m-3 badge bg-dark bg-opacity-75">
                    Preview Banner
                  </span>
                </div>
              )}
            </div>

            <div className="col-12 d-flex justify-content-end gap-3 pt-3 border-top">
              <button
                type="button"
                className="btn btn-gt-outline px-4"
                onClick={() => navigate("/my-trips")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gt-primary px-5 fw-bold">
                Create & Add Stops <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
