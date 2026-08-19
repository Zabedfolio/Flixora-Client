import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Flixora',
    template: '%s | Flixora',
  },
  description: 'Discover and watch movies and TV shows with Flixora.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen w-full overflow-x-hidden bg-black text-white">
        <Navbar />

        <main className="w-full">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
