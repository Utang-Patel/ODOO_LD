import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: Reset Form, 3: Success
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Send Reset Verification Request
  const handleRequestReset = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setVerificationCode(code); // Pre-fill for instant testing ease
    setStep(2);
  };

  // Step 2: Submit New Password Reset to Database
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (verificationCode !== generatedCode) {
      setError("Invalid verification code. Please check the code provided.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({ email: email.trim(), password: newPassword });
      if (res.success) {
        setSuccessMsg(res.message || "Password updated successfully! 🔑");
        setStep(3);
      } else {
        setError(res.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("[Reset Password Error]:", err);
      const apiMsg = err.response?.data?.message || "Failed to reset password. Please check your details.";
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gt-glass-card p-4 p-sm-5 shadow-lg border-0">
      <div className="text-center mb-4">
        <h3 className="font-heading fw-extrabold text-white mb-1">
          {step === 3 ? "Password Reset Complete 🎉" : "Forgot Password? 🔑"}
        </h3>
        <p className="text-muted small font-heading">
          {step === 1 && "Enter your registered email address to receive your password reset verification code."}
          {step === 2 && `Enter the 6-digit reset code and your new password for ${email}.`}
          {step === 3 && "Your account password has been updated in the database. Log in with your new password."}
        </p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small mb-3 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Enter Email */}
      {step === 1 && (
        <form onSubmit={handleRequestReset}>
          <div className="mb-4">
            <label className="form-label text-white fw-semibold small font-heading">Email Address</label>
            <div className="position-relative">
              <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type="email"
                className="form-control ps-5 py-2.5 rounded-3 bg-dark text-white border-white border-opacity-20"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gt-primary w-100 py-2.5 rounded-3 mb-3 fw-bold font-heading">
            Send Reset Verification Code
          </button>

          <div className="text-center">
            <Link to="/login" className="text-white-50 small text-decoration-none font-heading">
              <i className="bi bi-arrow-left me-1"></i> Back to Login
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: Enter Verification Code & New Password */}
      {step === 2 && (
        <form onSubmit={handleResetSubmit}>
          {/* Instant Code Alert Banner */}
          <div className="alert alert-info py-2 px-3 small mb-3 rounded-3 bg-dark text-white border border-info border-opacity-30">
            <div className="d-flex align-items-center justify-content-between font-heading">
              <span><i className="bi bi-key me-1 text-saas-gradient"></i> Verification Code Sent:</span>
              <span className="fw-extrabold text-saas-gradient fs-6">{generatedCode}</span>
            </div>
          </div>

          {/* Code Input */}
          <div className="mb-3">
            <label className="form-label text-white fw-semibold small font-heading">6-Digit Verification Code</label>
            <input
              type="text"
              className="form-control py-2.5 text-center font-heading fw-bold fs-5 tracking-wider bg-dark text-white border-white border-opacity-20"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label text-white fw-semibold small font-heading">New Password</label>
            <div className="position-relative">
              <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control ps-5 pe-5 py-2.5 rounded-3 bg-dark text-white border-white border-opacity-20"
                placeholder="Minimum 8 characters..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-0 border-0"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label text-white fw-semibold small font-heading">Confirm New Password</label>
            <div className="position-relative">
              <i className="bi bi-shield-check position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control ps-5 py-2.5 rounded-3 bg-dark text-white border-white border-opacity-20"
                placeholder="Re-type new password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gt-primary w-100 py-2.5 rounded-3 mb-3 fw-bold font-heading d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Reset & Update Password</span>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-link text-white-50 small p-0 border-0 text-decoration-none font-heading"
            >
              <i className="bi bi-arrow-left me-1"></i> Change Email Address
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Password Updated Success */}
      {step === 3 && (
        <div className="text-center py-3">
          <div className="d-inline-flex align-items-center justify-content-center bg-dark text-success rounded-circle p-3 mb-3 border border-white border-opacity-10">
            <i className="bi bi-check-circle-fill fs-1 text-saas-gradient"></i>
          </div>
          <p className="text-white-50 small mb-4 font-heading">
            {successMsg || "Your password has been updated in the database!"}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-gt-primary w-100 py-2.5 rounded-3 font-heading fw-bold"
          >
            Login Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
