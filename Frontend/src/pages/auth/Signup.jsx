import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    signup(name, email, password);
    navigate("/dashboard");
  };

  return (
    <div className="gt-card p-4 p-sm-5 shadow-lg border-0">
      <div className="text-center mb-4">
        <h3 className="font-heading fw-extrabold text-navy-deep mb-1">Start Your Adventure ✈️</h3>
        <p className="text-muted small">Create your GlobeTrotter account in seconds.</p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small mb-3" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-navy-deep fw-semibold small">Full Name</label>
          <div className="position-relative">
            <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control ps-5 py-2.5 rounded-3"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
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

        <div className="mb-3">
          <label className="form-label text-navy-deep fw-semibold small">Password</label>
          <div className="position-relative">
            <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="password"
              className="form-control ps-5 py-2.5 rounded-3"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-navy-deep fw-semibold small">Confirm Password</label>
          <div className="position-relative">
            <i className="bi bi-check2-circle position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="password"
              className="form-control ps-5 py-2.5 rounded-3"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-gt-primary w-100 py-2.5 rounded-3 mb-3 fw-bold">
          Create Account
        </button>

        <div className="text-center">
          <p className="small text-muted mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-ocean-blue fw-bold text-decoration-none">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
