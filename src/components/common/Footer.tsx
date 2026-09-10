"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaGooglePay,
  FaApplePay,
  FaPaypal,
} from "react-icons/fa";

// bKash Custom Icon Component
const BkashIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 19h20L12 2zm0 4l6.5 11h-13L12 6z" />
  </svg>
);

// Nagad Custom Icon Component
const NagadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

interface FooterLink {
  label: string;
  href: string;
}

interface Column {
  title: string;
  links: FooterLink[];
}

const COLUMNS: Column[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Movies", href: "/explore" },
      { label: "TV Shows", href: "/explore" },
      { label: "Anime", href: "/explore" },
      { label: "Genres", href: "/explore" },
      { label: "New Releases", href: "/trending" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Manage Subscription", href: "/dashboard/subscription" },
      { label: "Billing", href: "/dashboard/subscription" },
      { label: "Account Settings", href: "/dashboard/setting" },
      { label: "Help Center", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Preferences", href: "/" },
      { label: "Content Guidelines", href: "/" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "Twitter/X", icon: FaTwitter, href: "#" },
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
];

const PAYMENT_METHODS = [
  { name: "bKash", icon: BkashIcon, color: "hover:text-[#D12053] hover:border-[#D12053]/50" },
  { name: "Nagad", icon: NagadIcon, color: "hover:text-[#F7921E] hover:border-[#F7921E]/50" },
  { name: "Visa", icon: FaCcVisa, color: "hover:text-[#1A1F71] hover:border-[#1A1F71]/50" },
  { name: "Mastercard", icon: FaCcMastercard, color: "hover:text-[#EB001B] hover:border-[#EB001B]/50" },
  { name: "Amex", icon: FaCcAmex, color: "hover:text-[#006FCF] hover:border-[#006FCF]/50" },
  { name: "PayPal", icon: FaPaypal, color: "hover:text-[#003087] hover:border-[#003087]/50" },
  { name: "Google Pay", icon: FaGooglePay, color: "hover:text-[#4285F4] hover:border-[#4285F4]/50" },
  { name: "Apple Pay", icon: FaApplePay, color: "hover:text-white hover:border-white/50" },
];

// Continuous Marquee Array
const DOUBLE_PAYMENT_METHODS = [...PAYMENT_METHODS, ...PAYMENT_METHODS];

export default function Footer() {
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  const pathname = usePathname();

  const toggleSection = (index: number) => {
    setExpandedSections((previous) => ({
      ...previous,
      [index]: !previous[index],
    }));
  };

  if (
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <footer className="w-full overflow-hidden border-t border-[#1A1A1A] bg-[#000000] px-4 pb-10 pt-10 text-zinc-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#1A1A1A]/60 pb-10 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <Link
              href="/"
              aria-label="Flixora home"
              className="rounded outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00]"
            >
              <Image
                src="/logo.png"
                alt="Flixora"
                width={160}
                height={160}
                className="h-14 w-auto object-contain md:h-16"
              />
            </Link>

            <p className="text-sm font-medium tracking-wide text-zinc-400">
              Your stories. Your way.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3.5">
            {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-300 outline-none transition-colors hover:border-[#FF4C00] hover:text-[#FF4C00] focus-visible:ring-2 focus-visible:ring-[#FF4C00]"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
          {COLUMNS.map((column, index) => {
            const isExpanded = expandedSections[index] ?? false;

            return (
              <div key={column.title}>
                <button
                  type="button"
                  onClick={() => toggleSection(index)}
                  className="flex w-full items-center justify-between border-b border-[#1A1A1A]/50 py-4 text-left md:cursor-default md:border-none md:py-0"
                >
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {column.title}
                    </h3>

                    <div className="mt-2 hidden h-[2.5px] w-8 bg-[#FF4C00] md:block" />
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden"
                  >
                    <ChevronDown
                      size={18}
                      className={isExpanded ? "text-[#FF4C00]" : "text-zinc-400"}
                    />
                  </motion.div>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:block">
                  <ul className="space-y-3.5 py-6">
                    {column.links.map((link, linkIndex) => (
                      <li key={`${column.title}-${link.label}-${linkIndex}`}>
                        <Link
                          href={link.href}
                          className="rounded text-sm font-medium md:text-xl text-zinc-400 outline-none transition-colors hover:text-[#FF4C00] focus-visible:text-[#FF4C00]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden md:hidden"
                    >
                      <ul className="space-y-3.5 py-4">
                        {column.links.map((link, linkIndex) => (
                          <li key={`${column.title}-${link.label}-${linkIndex}`}>
                            <Link
                              href={link.href}
                              className="rounded text-sm font-medium text-zinc-400 outline-none transition-colors hover:text-[#FF4C00]"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* PAYMENT MARQUEE ANIMATION SECTION */}
        <div className="w-full border-y border-[#1A1A1A]/80 py-6">
          <div className="group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            
            {/* CSS to control the infinite scroll smoothly and pause on hover */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee-scroll {
                animation: marqueeScroll 25s linear infinite;
              }
              .group:hover .animate-marquee-scroll {
                animation-play-state: paused;
              }
            `}} />

            <div className="animate-marquee-scroll flex min-w-full flex-shrink-0 items-center justify-around gap-6 py-4">
              {DOUBLE_PAYMENT_METHODS.map((method, idx) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={`${method.name}-${idx}`}
                    whileHover={{ scale: 1.25, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    /* Z-Index fix: Added 'relative z-0 hover:z-50' */
                    className={`relative z-0 flex cursor-pointer items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950 px-4 py-2 text-zinc-400 shadow-md transition-colors duration-300 hover:z-50 ${method.color}`}
                    title={method.name}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-bold tracking-wider text-zinc-200 whitespace-nowrap">
                      {method.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="order-2 text-center text-xs font-medium text-zinc-500 md:order-1 md:text-left">
            © 2026 Flixora. All rights reserved.
          </p>

          {/* Language Selector */}
          <div className="relative order-1 flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-zinc-300 transition-colors hover:border-[#FF4C00]/60 hover:text-white md:order-2">
            <Globe size={16} className="mr-2.5 text-[#FF4C00]" />

            <select
              aria-label="Select language"
              defaultValue="en-US"
              className="cursor-pointer appearance-none bg-transparent pr-6 text-xs font-bold text-zinc-200 outline-none"
            >
              <option value="en-US" className="bg-[#0A0A0A] text-white">
                English (US)
              </option>
              <option value="bn-BD" className="bg-[#0A0A0A] text-white">
                বাংলা (BD)
              </option>
              <option value="es-ES" className="bg-[#0A0A0A] text-white">
                Español
              </option>
              <option value="fr-FR" className="bg-[#0A0A0A] text-white">
                Français
              </option>
            </select>

            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-3.5 text-zinc-400"
            />
          </div>
        </div>

      </div>
    </footer>
  );
}