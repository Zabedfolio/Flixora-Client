import React from "react";
import SideNavbar from "./Side-Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: RootLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#0f0f13] text-white">
      <SideNavbar />
      {children}
    </div>
  );
};

export default layout;
