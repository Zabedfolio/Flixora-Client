import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "react-hot-toast";

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
      className="antialiased"
    >
      <body className="min-h-full flex flex-col overflow-x-hidden w-full relative">
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
        <Navbar myListCount={5} />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
