'use client';

import React, { useState } from 'react';
import { Globe, ChevronDown, Film } from 'lucide-react';
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface LinkItem {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: LinkItem[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Movies', href: '/movies' },
      { label: 'TV Shows', href: '/shows' },
      { label: 'Anime', href: '/anime' },
      { label: 'Genres', href: '/genres' },
      { label: 'New Releases', href: '/new' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Manage Subscription', href: '/subscription' },
      { label: 'Billing', href: '/billing' },
      { label: 'Account Settings', href: '/settings' },
      { label: 'Help Center', href: '/help' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Preferences', href: '/cookies' },
      { label: 'Content Guidelines', href: '/guidelines' },
    ],
  },
];

export default function Footer() {
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-[#1A1A1A] pt-14 pb-8 px-4 md:px-8 select-none text-zinc-500 z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* TOP AREA: Logo, tagline, and socials */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
            <Link
              href="/"
              className="outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] rounded px-1 -mx-1"
            >
              <Image
                width={150}
                height={150}
                src="/logo.png"
                alt="Flixora Logo"
                className="h-14 md:h-16 object-cover"
              />
            </Link>
            <p className="text-xs text-zinc-500 font-medium">
              Your stories. Your way.
            </p>
          </div>

          {/* Social Icons Row */}
          <div className="flex items-center justify-center gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-zinc-900 hover:border-[#FF4C00]/50 flex items-center justify-center text-zinc-500 hover:text-[#FF4C00] hover:scale-105 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] focus-visible:text-[#FF4C00]"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="#"
              aria-label="Twitter/X"
              className="w-9 h-9 rounded-full border border-zinc-900 hover:border-[#FF4C00]/50 flex items-center justify-center text-zinc-500 hover:text-[#FF4C00] hover:scale-105 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] focus-visible:text-[#FF4C00]"
            >
              <FaTwitter size={16} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-zinc-900 hover:border-[#FF4C00]/50 flex items-center justify-center text-zinc-500 hover:text-[#FF4C00] hover:scale-105 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] focus-visible:text-[#FF4C00]"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full border border-zinc-900 hover:border-[#FF4C00]/50 flex items-center justify-center text-zinc-500 hover:text-[#FF4C00] hover:scale-105 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] focus-visible:text-[#FF4C00]"
            >
              <FaYoutube size={16} />
            </a>
          </div>
        </div>

        {/* MIDDLE AREA: Columns (Responsive Grid & Accordion) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-8 border-t border-[#1A1A1A]/30 pt-8 md:pt-4">
          {FOOTER_COLUMNS.map((column, index) => {
            const isExpanded = expandedSections[index] || false;
            return (
              <div key={index} className="flex flex-col md:gap-1.5 w-full">
                {/* Header: Accordion Row on Mobile, Static Header on Tablet/Desktop */}
                <div
                  onClick={() => toggleSection(index)}
                  className="flex items-center justify-between w-full py-4 md:py-0 border-b border-[#1A1A1A]/50 md:border-none cursor-pointer md:cursor-default"
                >
                  <div className="flex flex-col">
                    <h3 className="text-white text-xs font-bold tracking-wider uppercase select-none">
                      {column.title}
                    </h3>
                    <div className="w-6 h-[2.5px] bg-[#FF4C00] mt-1.5 hidden md:block" />
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-zinc-500 md:hidden transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-[#FF4C00]' : ''
                    }`}
                  />
                </div>

                {/* Links Container */}
                <div
                  className={`md:block transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? 'max-h-[250px] opacity-100 mt-3 pb-4'
                      : 'max-h-0 md:max-h-none opacity-0 md:opacity-100 mt-0'
                  }`}
                >
                  <ul className="space-y-3 pl-1 md:pl-0">
                    {column.links.map((link, idx) => (
                      <li key={idx}>
                        <Link
                          href={link.href}
                          className="text-[13px] font-medium text-[#B3B3B3] hover:text-[#FF4C00] hover:underline hover:underline-offset-4 decoration-[#FF4C00]/40 transition-all duration-150 outline-none focus-visible:text-[#FF4C00] focus-visible:ring-2 focus-visible:ring-[#FF4C00]/70 rounded px-1.5 py-0.5 -mx-1.5"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM BAR: copyright, language, and payments */}
        <div className="border-t border-[#1A1A1A] pt-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] text-zinc-600 text-center md:text-left order-3 md:order-1 select-none">
            © 2026 Flixora. All rights reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-2.5 text-zinc-700 text-[10px] font-bold tracking-widest order-2 select-none">
            <span className="px-2 py-0.5 border border-zinc-900 rounded bg-[#0A0A0A]">
              VISA
            </span>
            <span className="px-2 py-0.5 border border-zinc-900 rounded bg-[#0A0A0A]">
              MC
            </span>
            <span className="px-2 py-0.5 border border-zinc-900 rounded bg-[#0A0A0A]">
              AMEX
            </span>
            <span className="px-2 py-0.5 border border-zinc-900 rounded bg-[#0A0A0A]">
              PAYPAL
            </span>
          </div>

          {/* Region/Language selector */}
          <div className="relative flex items-center bg-zinc-950 border border-zinc-900 hover:border-[#FF4C00]/50 rounded-full px-3.5 py-2 text-zinc-400 hover:text-white transition-all duration-200 order-1 md:order-3 shadow-sm select-none">
            <Globe
              size={14}
              className="text-[#FF4C00] mr-2 pointer-events-none"
            />
            <select
              className="bg-transparent text-xs font-bold pr-5 outline-none appearance-none cursor-pointer focus-visible:ring-0 select-none"
              aria-label="Select Language"
              defaultValue="en-US"
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
              <option value="ja-JP">日本語</option>
            </select>
            <ChevronDown
              size={11}
              className="absolute right-3.5 text-zinc-500 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
