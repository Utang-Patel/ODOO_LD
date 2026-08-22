import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";
import CursorGlow from "../components/CursorGlow";

const DashboardLayout = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("globetrotter_sidebar_collapsed") === "true";
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const nextState = !prev;
      localStorage.setItem("globetrotter_sidebar_collapsed", String(nextState));
      return nextState;
    });
  };

  return (
    <div className="d-flex min-vh-100 position-relative overflow-x-hidden" style={{ backgroundColor: "#070B1A" }}>
      <CursorGlow />

      {/* Desktop & Tablet Fixed Sidebar with Logo Dot Toggle */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
      />

      {/* Mobile Offcanvas Sidebar Drawer */}
      <MobileNavbar
        show={showMobileSidebar}
        onHide={() => setShowMobileSidebar(false)}
      />

      {/* Main Content Area beside Fixed Sidebar */}
      <div
        className={`d-flex flex-column flex-grow-1 min-vh-100 overflow-x-hidden ${
          isSidebarCollapsed ? "gt-main-content-collapsed" : "gt-main-content-expanded"
        }`}
        style={{ backgroundColor: "#070B1A" }}
      >
        <Navbar
          onToggleMobileSidebar={() => setShowMobileSidebar(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="p-3 p-md-4 p-lg-5 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
