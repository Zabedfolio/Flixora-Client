import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import RouteTransition from "@/components/common/RouteTransition";

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
      className="antialiased"
    >
      <body className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-[#E5E5E5]">
        <RouteTransition>
          <Navbar myListCount={5} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </RouteTransition>
      </body>
    </html>
  );
}
