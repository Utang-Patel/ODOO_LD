import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("alex.morgan@globetrotter.io");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    login(email, password);
    navigate("/dashboard");
  };

  return (
    <div className="gt-card p-4 p-sm-5 shadow-lg border-0">
      <div className="text-center mb-4">
        <h3 className="font-heading fw-extrabold text-navy-deep mb-1">Welcome Back 👋</h3>
        <p className="text-muted small">Continue your personalized travel journey.</p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small mb-3" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label text-navy-deep fw-semibold small mb-0">Password</label>
            <Link to="/forgot-password" className="text-ocean-blue small text-decoration-none">
              Forgot Password?
            </Link>
          </div>
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

        <button type="submit" className="btn btn-gt-primary w-100 py-2.5 rounded-3 mb-3 fw-bold">
          Log In
        </button>

        <div className="text-center">
          <p className="small text-muted mb-0">
            Don't have an account?{" "}
            <Link to="/signup" className="text-ocean-blue fw-bold text-decoration-none">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
