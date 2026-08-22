import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

const DashboardLayout = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="dashboard-wrapper">
      {/* Desktop & Tablet Permanent Sidebar */}
      <Sidebar />

      {/* Mobile Offcanvas Sidebar Drawer */}
      <MobileNavbar
        show={showMobileSidebar}
        onHide={() => setShowMobileSidebar(false)}
      />

      {/* Main Content Area */}
      <div className="main-content-area min-vh-100 bg-cloud-bg">
        <Navbar onToggleMobileSidebar={() => setShowMobileSidebar(true)} />
        <main className="p-3 p-md-4 p-lg-5 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
