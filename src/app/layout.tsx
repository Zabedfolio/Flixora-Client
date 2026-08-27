import type { Metadata } from 'next';
import './globals.css';

import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import RouteTransition from '@/components/common/RouteTransition';
import { Toaster } from 'react-hot-toast';
import SignupModal from '@/components/SignupPopup';

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title: {
    default: 'Flixora',
    template: '%s | Flixora',
  },

  description: 'Discover and watch movies and TV shows with Flixora.',
};

/* =========================================================
   TYPES
========================================================= */

interface RootLayoutProps {
  children: React.ReactNode;
}

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="antialiased overflow-x-hidden">
      <body className="min-h-screen w-full overflow-x-hidden bg-black">
        <RouteTransition>
          {/* Toast */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#141414',
                color: '#fff',
                border: '1px solid #1A1A1A',
                fontSize: '13px',
                fontFamily: 'sans-serif',
                borderRadius: '12px',
              },
            }}
          />

          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <Footer />
        </RouteTransition>
        <SignupModal />
      </body>
    </html>
  );
}
