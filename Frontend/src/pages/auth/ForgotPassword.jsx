import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="gt-card p-4 p-sm-5 shadow-lg border-0">
      <div className="text-center mb-4">
        <h3 className="font-heading fw-extrabold text-navy-deep mb-1">Forgot Password? 🔑</h3>
        <p className="text-muted small">Enter your email and we'll process your password reset request.</p>
      </div>

      {submitted ? (
        <div className="text-center py-3">
          <div className="d-inline-flex align-items-center justify-content-center bg-light text-success rounded-circle p-3 mb-3">
            <i className="bi bi-envelope-check fs-2"></i>
          </div>
          <h5 className="font-heading fw-bold text-navy-deep mb-2">Request Processed</h5>
          <p className="text-muted small mb-4">
            If an account exists with <strong>{email}</strong>, a password reset link has been dispatched to your inbox.
          </p>
          <Link to="/login" className="btn btn-gt-outline w-100 py-2.5 rounded-3">
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-navy-deep fw-semibold small">Email Address</label>
            <div className="position-relative">
              <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="email"
                className="form-control ps-5 py-2.5 rounded-3"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gt-primary w-100 py-2.5 rounded-3 mb-3 fw-bold">
            Send Reset Link
          </button>

          <div className="text-center">
            <Link to="/login" className="text-muted small text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i> Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
