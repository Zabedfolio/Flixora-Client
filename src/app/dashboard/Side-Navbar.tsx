"use client";

import React from "react";
import Sidebar from "@/components/common/Sidebar";

interface SideNavbarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SideNavbar({ isOpen, onClose }: SideNavbarProps) {
  return <Sidebar isOpen={isOpen} onClose={onClose} />;
}