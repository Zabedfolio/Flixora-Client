import React from "react";
import SideNavbar from "./Side-Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: RootLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-black text-white w-full">
      <SideNavbar />
      <div className="flex-1 w-full min-w-0">
        {children}
      </div>
    </div>
  );
};

export default layout;
