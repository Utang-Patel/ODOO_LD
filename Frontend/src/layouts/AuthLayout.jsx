import React from "react";
import { Outlet, Link } from "react-router-dom";
import logoPng from "../assets/logo.png";
import CursorGlow from "../components/CursorGlow";

const AuthLayout = () => {
  return (
    <div className="min-vh-100 d-flex position-relative overflow-hidden" style={{ backgroundColor: "#070B1A" }}>
      <CursorGlow />
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          {/* Left Branding / Visual Panel */}
          <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 position-relative overflow-hidden text-white" style={{ backgroundColor: "#0B1026" }}>
            {/* Background Decorative Blur Gradients */}
            <div
              className="position-absolute top-0 start-0 translate-middle rounded-circle animate-blob-1"
              style={{
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(236, 72, 153, 0.1) 70%, transparent 100%)",
                filter: "blur(90px)"
              }}
            ></div>
            <div
              className="position-absolute bottom-0 end-0 translate-middle-x rounded-circle animate-blob-2"
              style={{
                width: "400px",
                height: "400px",
                background: "radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)",
                filter: "blur(80px)"
              }}
            ></div>

            {/* Top Branding Logo */}
            <div className="position-relative z-1">
              <Link to="/" className="d-inline-flex align-items-center gap-3 text-decoration-none">
                <div
                  className="rounded-3 p-1.5 d-flex align-items-center justify-content-center shadow-lg"
                  style={{ backgroundColor: "#FFFFFF", width: "46px", height: "46px", flexShrink: 0 }}
                >
                  <img
                    src={logoPng}
                    alt="GlobeTrotter Logo"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <span className="font-heading fs-3 fw-extrabold text-white text-nowrap">
                  Globe<span className="text-saas-gradient">Trotter</span>
                </span>
              </Link>
            </div>

            {/* Hero Graphic Content (Without Paris Component) */}
            <div className="position-relative z-1 my-auto py-5">
              <div className="mb-4">
                <span className="badge bg-dark bg-opacity-60 text-saas-gradient px-3.5 py-2 rounded-pill fw-semibold mb-3 border border-white border-opacity-10 font-heading">
                  ✨ Empowering Personalized Travel Planning
                </span>
                <h1 className="font-heading display-4 fw-extrabold text-white mb-3" style={{ lineHeight: 1.15 }}>
                  Design Your Next Journey <br />
                  <span className="text-saas-gradient">In Minutes.</span>
                </h1>
                <p className="text-white-50 lead fs-6 max-w-md font-heading">
                  Personalized multi-city itineraries, smart budget management, interactive visual timelines, and seamless public trip sharing.
                </p>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="position-relative z-1">
              <p className="small text-white-50 mb-0 font-heading">
                © {new Date().getFullYear()} GlobeTrotter SaaS Edition. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-sm-5" style={{ backgroundColor: "#070B1A" }}>
            <div className="w-100" style={{ maxWidth: "440px" }}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
