'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ChevronDown, Globe } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
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
      {
        label: 'Manage Subscription',
        href: '/subscription',
      },
      {
        label: 'Billing',
        href: '/billing',
      },
      {
        label: 'Account Settings',
        href: '/settings',
      },
      {
        label: 'Help Center',
        href: '/help',
      },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        label: 'Privacy Policy',
        href: '/privacy',
      },
      {
        label: 'Terms of Service',
        href: '/terms',
      },
      {
        label: 'Cookie Preferences',
        href: '/cookies',
      },
      {
        label: 'Content Guidelines',
        href: '/guidelines',
      },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    icon: FaInstagram,
    href: '#',
  },
  {
    label: 'Twitter/X',
    icon: FaTwitter,
    href: '#',
  },
  {
    label: 'Facebook',
    icon: FaFacebookF,
    href: '#',
  },
  {
    label: 'YouTube',
    icon: FaYoutube,
    href: '#',
  },
];

const PAYMENT_METHODS = ['VISA', 'MC', 'AMEX', 'PAYPAL'];

export default function Footer() {
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});
  const pathname = usePathname();

  const toggleSection = (index: number) => {
    setExpandedSections(previous => ({
      ...previous,
      [index]: !previous[index],
    }));
  };

  // Hide Footer on authentication routes
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  return (
    <footer className="w-full overflow-hidden border-t border-[#1A1A1A] bg-[#0A0A0A] px-4 pb-8 pt-14 text-zinc-500">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#1A1A1A]/50 pb-8 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <Link
              href="/"
              aria-label="Flixora home"
              className="rounded outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00]"
            >
              <Image
                src="/logo.png"
                alt="Flixora"
                width={150}
                height={150}
                className="h-14 w-auto object-contain md:h-16"
              />
            </Link>

            <p className="text-xs font-medium text-zinc-500">
              Your stories. Your way.
            </p>
          </div>

          {/* Socials */}
          <div className="flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-900 text-zinc-500 outline-none transition-all duration-200 hover:scale-105 hover:border-[#FF4C00]/50 hover:text-[#FF4C00] focus-visible:ring-2 focus-visible:ring-[#FF4C00]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column, index) => {
            const isExpanded = expandedSections[index] ?? false;

            return (
              <div key={column.title}>
                {/* Column Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(index)}
                  className="flex w-full items-center justify-between border-b border-[#1A1A1A]/50 py-4 text-left md:cursor-default md:border-none md:py-0"
                >
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      {column.title}
                    </h3>

                    <div className="mt-1.5 hidden h-[2.5px] w-6 bg-[#FF4C00] md:block" />
                  </div>

                  <ChevronDown
                    size={14}
                    className={`text-zinc-500 transition-transform duration-300 md:hidden ${
                      isExpanded ? 'rotate-180 text-[#FF4C00]' : ''
                    }`}
                  />
                </button>

                {/* Links */}
                <div
                  className={`overflow-hidden transition-all duration-300 md:block ${
                    isExpanded
                      ? 'max-h-[300px] opacity-100'
                      : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
                  }`}
                >
                  <ul className="space-y-3 py-4 md:py-5">
                    {column.links.map(link => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="rounded text-[13px] font-medium text-[#B3B3B3] outline-none transition-colors hover:text-[#FF4C00] focus-visible:text-[#FF4C00] focus-visible:ring-2 focus-visible:ring-[#FF4C00]/50"
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

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-[#1A1A1A] pt-8 md:flex-row">
          {/* Copyright */}
          <p className="order-3 text-center text-[11px] text-zinc-600 md:order-1 md:text-left">
            © 2026 Flixora. All rights reserved.
          </p>

          {/* Payments */}
          <div className="order-2 flex items-center gap-2.5 text-[10px] font-bold tracking-widest text-zinc-700">
            {PAYMENT_METHODS.map(method => (
              <span
                key={method}
                className="rounded border border-zinc-900 bg-[#0A0A0A] px-2 py-0.5"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Language */}
          <div className="order-1 relative flex items-center rounded-full border border-zinc-900 bg-zinc-950 px-3.5 py-2 text-zinc-400 transition-colors hover:border-[#FF4C00]/50 hover:text-white md:order-3">
            <Globe size={14} className="mr-2 text-[#FF4C00]" />

            <select
              aria-label="Select language"
              defaultValue="en-US"
              className="cursor-pointer appearance-none bg-transparent pr-5 text-xs font-bold outline-none"
            >
              <option value="en-US">English (US)</option>

              <option value="es-ES">Español</option>

              <option value="fr-FR">Français</option>

              <option value="ja-JP">日本語</option>
            </select>

            <ChevronDown
              size={11}
              className="pointer-events-none absolute right-3.5 text-zinc-500"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
