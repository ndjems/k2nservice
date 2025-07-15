// src/layout/MainLayout.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [expanded, setExpanded] = React.useState(true);
  // Largeur dynamique de la sidebar
  const sidebarWidth = expanded ? 256 : 48; // px

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header toggleSidebar={() => setExpanded((prev) => !prev)} />

      {/* Body: sidebar + content */}
      <div className="flex flex-1">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />

        {/* Page content injecté par le router */}
        <main
          className="flex-1 bg-gray-100 p-4 transition-all duration-300"
          style={{ marginLeft: sidebarWidth }}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
